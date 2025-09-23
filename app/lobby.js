import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";

export default function Lobby() {
  const { playerName } = useLocalSearchParams();
  const router = useRouter();

  const [players, setPlayers] = useState([]);

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

  const egyptButtonStyle = {
    marginTop: 20,
    backgroundColor: "#D9C9A3", // Pergament-Farbe
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#5C4033", // dunkler Rand
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 5,
    elevation: 6,
  };

  const egyptTextStyle = {
    color: "#2E1F12", // sehr dunkles Braun
    fontSize: 18,
    fontWeight: "bold",
    textShadowColor: "rgba(255,255,255,0.3)", // leichter Aufheller
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  };

  return (
    <LinearGradient
      colors={["#1a0033", "#000000"]}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
      }}
    >
      <Text style={{ fontSize: 22, color: "#fff", marginBottom: 20 }}>
        🔥 Lobby
      </Text>

      <Text style={{ fontWeight: "bold", color: "#fff", marginBottom: 10 }}>
        Spieler in der Lobby:
      </Text>
      {players.map((p, i) => (
        <Text key={i} style={{ color: "#fff", fontSize: 16 }}>
          👤 {p}
        </Text>
      ))}

      {/* Spiel starten Button */}
      <TouchableOpacity style={egyptButtonStyle} onPress={startGame}>
        <Text style={egyptTextStyle}>▶️ Spiel starten</Text>
      </TouchableOpacity>

      {/* Galerie Button */}
      <TouchableOpacity
        style={[egyptButtonStyle, { marginTop: 15 }]}
        onPress={() => router.push("/gallery")}
      >
        <Text style={egyptTextStyle}>📖 Karten-Galerie</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}
