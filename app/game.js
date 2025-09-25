import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { db } from "../firebaseConfig";
import { gameStyles } from "../src/styles/gameStyles";
import { randomMagic } from "../src/utils/gameLogic";

export default function Game() {
  const { lobbyId, playerName } = useLocalSearchParams();
  const [lobby, setLobby] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  const lobbyRef = doc(db, "lobbies", lobbyId);

  // --- Live-Updates ---
  useEffect(() => {
    if (!lobbyId) return;
    const unsub = onSnapshot(lobbyRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setLobby({
          players: data.players || [],
          turn: data.turn ?? 0,
          lastMagic: data.lastMagic || null,
          showMagic: data.showMagic || false,
          discardPile: data.discardPile || [],
          round: data.round || 1,
          effectsUsed: data.effectsUsed || {},
          ...data,
        });
      }
    });
    return unsub;
  }, [lobbyId]);

  // --- Karte ziehen ---
  const handleDraw = async () => {
    if (!lobby) return;
    try {
      const newMagic = randomMagic();
      console.log("[DRAW] Neue Karte gezogen:", newMagic);
      await updateDoc(lobbyRef, {
        lastMagic: newMagic,
        showMagic: false,
      });
      // gezogene Karte sofort für mich im Modal anzeigen
      setSelectedCard({ ...newMagic, type: "magic" });
    } catch (err) {
      console.error("[DRAW ERROR]", err);
    }
  };

  // --- Karte zeigen ---
  const handleShow = async () => {
    try {
      console.log("[SHOW] Spieler zeigt Karte:", lobby.lastMagic);
      await updateDoc(lobbyRef, { showMagic: true });
    } catch (err) {
      console.error("[SHOW ERROR]", err);
    }
  };

  // --- Karte ablegen ---
  const handleDiscard = async () => {
    if (!lobby) return;
    const discardPile = [...(lobby.discardPile || []), lobby.lastMagic];
    const nextTurn = ((lobby.turn ?? 0) + 1) % (lobby.players?.length || 1);
    await updateDoc(lobbyRef, {
      discardPile,
      lastMagic: null,
      turn: nextTurn,
      showMagic: false,
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

  const players = lobby.players || [];
  const me = players.find((p) => p.name === playerName);
  const others = players.filter((p) => p.name !== playerName);
  const isMyTurn = players[lobby.turn]?.name === playerName;

  return (
    <LinearGradient
      colors={["#1a0033", "#000000"]}
      style={gameStyles.container}
    >
      <Text
        style={{
          color: "#fff",
          fontSize: 22,
          marginBottom: 10,
          textAlign: "center",
        }}
      >
        🎴 Spiel läuft – Lobby {lobbyId}
      </Text>

      {/* Gegnerkarten oben */}
      <View
        style={{
          flexDirection: "row", // alle Gegner nebeneinander
          justifyContent: "center",
          marginBottom: 40,
        }}
      >
        {others.map((p) => (
          <View
            key={p.id}
            style={{ alignItems: "center", marginHorizontal: 10 }}
          >
            {/* Karten nebeneinander */}
            <View style={{ flexDirection: "row", gap: 10 }}>
              {p.monster && (
                <Image
                  source={p.monster.image}
                  style={{ width: 60, height: 90 }}
                  resizeMode="cover"
                />
              )}
              {p.trap && (
                <Image
                  source={require("../assets/images/card_back.png")}
                  style={{ width: 60, height: 90 }}
                  resizeMode="cover"
                />
              )}
            </View>

            {/* Spielername */}
            <Text style={{ color: "#fff", marginTop: 5 }}>{p.name}</Text>
          </View>
        ))}
      </View>

      {/* Magiestapel in der Mitte */}
      <View style={{ alignItems: "center", marginBottom: 40 }}>
        <TouchableOpacity onPress={handleDraw}>
          <Image
            source={require("../assets/images/card_back.png")}
            style={{ width: 80, height: 120 }}
            resizeMode="cover"
          />
        </TouchableOpacity>
        <Text style={{ color: "#fff", marginTop: 5 }}>Magiestapel</Text>

        {isMyTurn && !lobby.lastMagic && (
          <TouchableOpacity
            onPress={handleDraw}
            style={{
              marginTop: 10,
              backgroundColor: "#D9C9A3",
              padding: 10,
              borderRadius: 8,
            }}
          >
            <Text>✨ Ziehen</Text>
          </TouchableOpacity>
        )}

        {lobby.lastMagic && (
          <View style={{ alignItems: "center", marginTop: 10 }}>
            {lobby.showMagic ? (
              <>
                <Image
                  source={lobby.lastMagic.image}
                  style={{ width: 100, height: 150 }}
                />
                <Text style={{ color: "#fff", marginTop: 5 }}>
                  {lobby.lastMagic.name}
                </Text>
                {isMyTurn && (
                  <TouchableOpacity
                    onPress={handleDiscard}
                    style={{
                      marginTop: 10,
                      backgroundColor: "#D9C9A3",
                      padding: 10,
                      borderRadius: 8,
                    }}
                  >
                    <Text>🗑️ Ablegen</Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              isMyTurn && (
                <TouchableOpacity
                  onPress={handleShow}
                  style={{
                    marginTop: 10,
                    backgroundColor: "#D9C9A3",
                    padding: 10,
                    borderRadius: 8,
                  }}
                >
                  <Text>👁️ Aufdecken</Text>
                </TouchableOpacity>
              )
            )}
          </View>
        )}
      </View>

      {/* Eigene Karten unten nebeneinander */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: "auto",
        }}
      >
        {me?.monster && (
          <Image
            source={me.monster.image}
            style={{ width: 100, height: 150, marginHorizontal: 10 }}
            resizeMode="cover"
          />
        )}
        {me?.trap && (
          <TouchableOpacity>
            <Image
              source={
                me.trapRevealed
                  ? me.trap.image
                  : require("../assets/images/card_back.png")
              }
              style={{ width: 100, height: 150, marginHorizontal: 10 }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
      </View>

      <Text style={{ color: "#fff", marginTop: 10, textAlign: "center" }}>
        {me?.name} (Du)
      </Text>
    </LinearGradient>
  );
  {
    /* Modal für vergrößerte Karten */
  }
  {
  }
}
