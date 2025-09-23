import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";

export default function Lobby() {
  const { playerName } = useLocalSearchParams();
  const router = useRouter();

  const [players, setPlayers] = useState([]);

  // Spieler beim Betreten hinzufügen
  useEffect(() => {
    if (playerName && !players.includes(playerName)) {
      setPlayers((prev) => [...prev, playerName]);
    }
  }, [playerName]);

  const startGame = () => {
    router.push({
      pathname: "/game",
      params: { players: JSON.stringify(players) },
    });
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
      }}
    >
      <Text style={{ fontSize: 20 }}>🔥 Lobby Screen</Text>

      <Text style={{ fontWeight: "bold" }}>Spieler in der Lobby:</Text>
      {players.map((p, i) => (
        <Text key={i}>👤 {p}</Text>
      ))}

      <Button title="Spiel starten" onPress={startGame} />

      {/* Button zur Galerie */}
      <TouchableOpacity
        style={{
          marginTop: 20,
          padding: 10,
          backgroundColor: "#333",
          borderRadius: 8,
        }}
        onPress={() => router.push("/gallery")}
      >
        <Text style={{ color: "#fff", fontSize: 16 }}>📖 Karten-Galerie</Text>
      </TouchableOpacity>
    </View>
  );
}
