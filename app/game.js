import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { db } from "../firebaseConfig";
import Card from "../src/components/Card";
import { gameStyles } from "../src/styles/gameStyles";
import { magics } from "../src/utils/magicCards"; // dein Magic-Karten-Array

// Zufällige Karte ziehen
const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

export default function Game() {
  const { lobbyId, playerName } = useLocalSearchParams();
  const [lobby, setLobby] = useState(null);

  const lobbyRef = doc(db, "lobbies", lobbyId);

  // Live-Updates der Lobby
  useEffect(() => {
    if (!lobbyId) return;
    const unsub = onSnapshot(lobbyRef, (snap) => {
      if (snap.exists()) {
        setLobby(snap.data());
      }
    });
    return unsub;
  }, [lobbyId]);

  // Ziehen-Button → neue Magiekarte + nächsten Spieler
  const handleDraw = async () => {
    const newMagic = random(magics);
    const nextTurn = (lobby.turn + 1) % lobby.players.length;

    await updateDoc(lobbyRef, {
      lastMagic: newMagic,
      turn: nextTurn,
    });
  };

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
          {lobby.players.map((p) => (
            <Text key={p.id} style={{ color: p.ready ? "#0f0" : "#fff" }}>
              {p.name} {p.isHost ? "(Host)" : ""} {p.ready ? "✅" : "⏳"}
            </Text>
          ))}
        </View>
      </LinearGradient>
    );
  }

  // Aktueller Spieler
  const currentPlayer = lobby.players[lobby.turn];
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
        {lobby.players.map((p, idx) => (
          <View key={p.id} style={{ alignItems: "center" }}>
            <Image
              source={require("../assets/card_back.png")}
              style={gameStyles.cardImage}
            />
            <Image
              source={require("../assets/card_back.png")}
              style={gameStyles.trapImage}
            />
            <Text style={{ color: "#fff" }}>
              {p.name} {idx === lobby.turn ? "⭐" : ""}
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
              ✨ Draw
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
    </LinearGradient>
  );
}
