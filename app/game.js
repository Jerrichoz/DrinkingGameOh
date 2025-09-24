import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import { db } from "../firebaseConfig";
import Card from "../src/components/Card";
import { gameStyles } from "../src/styles/gameStyles";
import { magics } from "../src/utils/magicCards";

// Zufällige Karte ziehen
const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

export default function Game() {
  const { lobbyId, playerName } = useLocalSearchParams();
  const [lobby, setLobby] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  const lobbyRef = doc(db, "lobbies", lobbyId);

  // Live-Updates der Lobby
  useEffect(() => {
    if (!lobbyId) return;
    const unsub = onSnapshot(lobbyRef, (snap) => {
      if (snap.exists()) {
        setLobby(snap.data());
      } else {
        setLobby(null);
      }
    });
    return unsub;
  }, [lobbyId]);

  // Karte ziehen
  const handleDraw = async () => {
    if (!lobby || !lobby.players) return;

    const newMagic = random(magics);
    const currentTurn = lobby.turn ?? 0;
    const nextTurn = (currentTurn + 1) % lobby.players.length;

    try {
      await updateDoc(lobbyRef, {
        lastMagic: newMagic,
        turn: nextTurn,
      });
    } catch (err) {
      console.error("[DRAW ERROR]", err);
    }
  };

  // Lade-Status
  if (!lobby) {
    return (
      <LinearGradient
        colors={["#1a0033", "#000000"]}
        style={gameStyles.container}
      >
        <Text style={{ color: "#fff" }}>⏳ Lade Lobby...</Text>
      </LinearGradient>
    );
  }

  // Lobby wartet noch
  if (lobby.status === "waiting") {
    return (
      <LinearGradient
        colors={["#1a0033", "#000000"]}
        style={gameStyles.container}
      >
        <Text style={{ color: "#fff", fontSize: 20 }}>
          ⏳ Warte auf Host, bis das Spiel startet...
        </Text>
        <View style={{ marginTop: 30 }}>
          {lobby.players?.map((p) => (
            <Text key={p.id} style={{ color: p.ready ? "#0f0" : "#fff" }}>
              {p.name} {p.isHost ? "(Host)" : ""} {p.ready ? "✅" : "⏳"}
            </Text>
          ))}
        </View>
      </LinearGradient>
    );
  }

  // Aktueller Spieler
  const players = lobby.players || [];
  const currentTurn = lobby.turn ?? 0;
  const currentPlayer = players[currentTurn];
  const isMyTurn = currentPlayer?.name === playerName;

  return (
    <LinearGradient
      colors={["#1a0033", "#000000"]}
      style={gameStyles.container}
    >
      <Text style={{ color: "#fff", fontSize: 22, marginBottom: 20 }}>
        🎴 Spiel läuft – Lobby {lobbyId}
      </Text>

      {/* Spielerübersicht */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: 40,
        }}
      >
        {players.map((p, idx) => (
          <View key={p.id} style={{ alignItems: "center" }}>
            {/* Monsterkarte → immer offen */}
            <TouchableOpacity
              onPress={() => setSelectedCard({ ...p.monster, type: "monster" })}
            >
              <Image
                source={
                  p.monster?.image
                    ? p.monster.image
                    : require("../assets/card_back.png")
                }
                style={gameStyles.cardImage}
              />
            </TouchableOpacity>

            {/* Fallenkarte → nur eigene anklickbar */}
            <TouchableOpacity
              onPress={() =>
                p.name === playerName &&
                setSelectedCard({ ...p.trap, type: "trap" })
              }
            >
              <Image
                source={require("../assets/card_back.png")}
                style={gameStyles.trapImage}
              />
            </TouchableOpacity>

            <Text style={{ color: "#fff" }}>
              {p.name} {idx === currentTurn ? "⭐" : ""}
            </Text>
          </View>
        ))}
      </View>

      {/* Magiestapel in der Mitte */}
      <View style={{ alignItems: "center", marginTop: 60 }}>
        <Image
          source={require("../assets/card_back.png")}
          style={{ width: 80, height: 120, resizeMode: "cover" }}
        />
        {isMyTurn && (
          <TouchableOpacity
            style={{
              marginTop: 12,
              backgroundColor: "#D9C9A3",
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 8,
              borderWidth: 2,
              borderColor: "#5C4033",
            }}
            onPress={handleDraw}
          >
            <Text style={{ color: "#2E1F12", fontWeight: "bold" }}>
              ✨ Ziehen
            </Text>
          </TouchableOpacity>
        )}
        <Text style={{ color: "#fff", marginTop: 10 }}>Magiestapel</Text>
      </View>

      {/* Letzte gezogene Magiekarte */}
      {lobby.lastMagic && (
        <View style={{ marginTop: 40, alignItems: "center" }}>
          <Text style={{ color: "#fff", marginBottom: 10 }}>
            Letzte Magiekarte:
          </Text>
          <Card
            title={lobby.lastMagic.name}
            effect={lobby.lastMagic.effect}
            image={lobby.lastMagic.image}
            type="magic"
          />
        </View>
      )}

      {/* Modal für Vergrößerung */}
      <Modal
        visible={!!selectedCard}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedCard(null)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.7)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {selectedCard && (
            <Card
              title={selectedCard.name}
              effect={selectedCard.effect}
              image={selectedCard.image}
              type={selectedCard.type}
            />
          )}
          <TouchableOpacity
            onPress={() => setSelectedCard(null)}
            style={{ marginTop: 20 }}
          >
            <Text style={{ color: "#fff", fontSize: 18 }}>Schließen</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </LinearGradient>
  );
}
