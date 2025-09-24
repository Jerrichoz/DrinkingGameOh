import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { db } from "../firebaseConfig";

const generateCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 5 })
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join("");
};

export default function Lobby() {
  const router = useRouter();
  const { playerName } = useLocalSearchParams();

  const [joinCode, setJoinCode] = useState("");
  const [createdCode, setCreatedCode] = useState(null);
  const [lobbyId, setLobbyId] = useState(null);
  const [players, setPlayers] = useState([]);

  const buttonStyle = {
    backgroundColor: "#D9C9A3",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#5C4033",
    marginTop: 20,
  };

  const textStyle = {
    color: "#2E1F12",
    fontSize: 16,
    fontWeight: "bold",
  };

  // Live-Updates der Lobby
  useEffect(() => {
    if (!lobbyId) return;
    const unsub = onSnapshot(doc(db, "lobbies", lobbyId), (snap) => {
      if (snap.exists()) {
        setPlayers(snap.data().players);
      }
    });
    return unsub;
  }, [lobbyId]);

  // Neue Lobby erstellen
  const createLobby = async () => {
    const code = generateCode();
    setCreatedCode(code);
    setLobbyId(code);

    await setDoc(doc(db, "lobbies", code), {
      players: [
        {
          id: Date.now().toString(),
          name: playerName,
          ready: false,
          isHost: true,
        },
      ],
      status: "waiting",
      createdAt: Date.now(),
    });
  };

  // Lobby beitreten
  const joinLobby = async () => {
    if (!joinCode) return;
    const ref = doc(db, "lobbies", joinCode);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      alert("❌ Lobby nicht gefunden!");
      return;
    }

    await updateDoc(ref, {
      players: arrayUnion({
        id: Date.now().toString(),
        name: playerName,
        ready: false,
        isHost: false,
      }),
    });

    setLobbyId(joinCode);
  };

  // Ready umschalten
  const toggleReady = async () => {
    if (!lobbyId) return;
    const ref = doc(db, "lobbies", lobbyId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      const updatedPlayers = data.players.map((p) =>
        p.name === playerName ? { ...p, ready: !p.ready } : p
      );
      await updateDoc(ref, { players: updatedPlayers });
    }
  };

  // Host startet das Spiel
  const startGame = async () => {
    const ref = doc(db, "lobbies", lobbyId);
    await updateDoc(ref, { status: "playing" });
    router.push({ pathname: "/game", params: { lobbyId, playerName } });
  };

  const me = players.find((p) => p.name === playerName);
  const allReady = players.length > 0 && players.every((p) => p.ready);

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
      <Text style={{ color: "#fff" }}>👤 Spielername: {playerName}</Text>

      {!lobbyId && (
        <>
          {/* Lobby erstellen */}
          <TouchableOpacity style={buttonStyle} onPress={createLobby}>
            <Text style={textStyle}>✨ Lobby erstellen</Text>
          </TouchableOpacity>

          {/* Lobby beitreten */}
          <TextInput
            placeholder="Lobby-Code eingeben"
            value={joinCode}
            onChangeText={setJoinCode}
            style={{
              marginTop: 30,
              backgroundColor: "#fff",
              padding: 10,
              borderRadius: 8,
              width: 200,
              textAlign: "center",
            }}
          />
          <TouchableOpacity style={buttonStyle} onPress={joinLobby}>
            <Text style={textStyle}>➡️ Beitreten</Text>
          </TouchableOpacity>
        </>
      )}

      {createdCode && (
        <Text style={{ color: "#fff", marginTop: 10 }}>
          📢 Dein Lobby-Code:{" "}
          <Text style={{ fontWeight: "bold" }}>{createdCode}</Text>
        </Text>
      )}

      {/* Spieler-Liste */}
      {players.length > 0 && (
        <View style={{ marginTop: 30, alignItems: "center" }}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            Spieler in Lobby:
          </Text>
          {players.map((p) => (
            <Text key={p.id} style={{ color: p.ready ? "#0f0" : "#fff" }}>
              {p.name} {p.isHost ? "(Host)" : ""} {p.ready ? "✅" : "⏳"}
            </Text>
          ))}
        </View>
      )}

      {/* Ready-Button */}
      {me && (
        <TouchableOpacity style={buttonStyle} onPress={toggleReady}>
          <Text style={textStyle}>
            {me.ready ? "❌ Nicht bereit" : "✅ Bereit"}
          </Text>
        </TouchableOpacity>
      )}

      {/* Host darf starten */}
      {me?.isHost && allReady && (
        <TouchableOpacity style={buttonStyle} onPress={startGame}>
          <Text style={textStyle}>▶️ Spiel starten</Text>
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
}
