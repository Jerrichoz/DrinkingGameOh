import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
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
  const [message, setMessage] = useState(null); // Meldungen im UI

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
    try {
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

      setMessage({ type: "success", text: `Lobby ${code} erstellt!` });
    } catch (error) {
      console.error("Create Lobby Error:", error);
      setMessage({
        type: "error",
        text: "❌ Fehler beim Erstellen der Lobby.",
      });
    }
  };

  // Lobby beitreten
  const joinLobby = async () => {
    if (!joinCode) {
      setMessage({ type: "error", text: "⚠️ Bitte gib einen Lobby-Code ein." });
      console.log(`[JOIN] ${playerName} → Kein Code eingegeben.`);
      return;
    }

    try {
      const code = joinCode.trim().toUpperCase();
      console.log(`[JOIN] ${playerName} versucht Lobby ${code} beizutreten…`);

      const ref = doc(db, "lobbies", code);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        console.warn(`[JOIN] Lobby ${code} existiert nicht!`);
        setMessage({ type: "error", text: `❌ Lobby ${code} nicht gefunden.` });
        return;
      }

      const data = snap.data();
      console.log(`[JOIN] Aktuelle Spieler in Lobby ${code}:`, data.players);

      // prüfen ob Spieler schon drin ist
      if (data.players.some((p) => p.name === playerName)) {
        console.log(`[JOIN] ${playerName} ist bereits in Lobby ${code}.`);
        setMessage({
          type: "info",
          text: "ℹ️ Du bist bereits in dieser Lobby.",
        });
        setLobbyId(code);
        return;
      }

      // neuen Spieler hinzufügen
      const newPlayer = {
        id: Date.now().toString(),
        name: playerName,
        ready: false,
        isHost: false,
      };

      const updatedPlayers = [...data.players, newPlayer];
      console.log(`[JOIN] Füge Spieler hinzu:`, newPlayer);

      await updateDoc(ref, { players: updatedPlayers });

      console.log(
        `[JOIN] ${playerName} erfolgreich Lobby ${code} beigetreten.`
      );
      setLobbyId(code);
      setMessage({
        type: "success",
        text: `✅ Du bist der Lobby ${code} beigetreten!`,
      });
    } catch (error) {
      console.error(`[JOIN ERROR] ${playerName} → Lobby ${joinCode}`, error);
      setMessage({
        type: "error",
        text: "❌ Fehler beim Beitreten. Bitte erneut versuchen.",
      });
    }
  };

  // Ready umschalten
  const toggleReady = async () => {
    if (!lobbyId) return;
    try {
      const ref = doc(db, "lobbies", lobbyId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        const updatedPlayers = data.players.map((p) =>
          p.name === playerName ? { ...p, ready: !p.ready } : p
        );
        await updateDoc(ref, { players: updatedPlayers });
      }
    } catch (error) {
      console.error("Toggle Ready Error:", error);
      setMessage({
        type: "error",
        text: "❌ Konnte Ready-Status nicht ändern.",
      });
    }
  };

  // Host startet das Spiel
  const startGame = async () => {
    try {
      const ref = doc(db, "lobbies", lobbyId);
      await updateDoc(ref, { status: "playing" });
      router.push({ pathname: "/game", params: { lobbyId, playerName } });
    } catch (error) {
      console.error("Start Game Error:", error);
      setMessage({ type: "error", text: "❌ Fehler beim Starten des Spiels." });
    }
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
        padding: 20,
      }}
    >
      {/* ✅ Status-Balken */}
      {(lobbyId || message) && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            padding: 10,
            backgroundColor:
              message?.type === "error"
                ? "#b71c1c" // rot
                : message?.type === "success"
                ? "#1b5e20" // grün
                : "#f57f17", // gelb
            alignItems: "center",
            zIndex: 100,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            {message ? message.text : `✅ Verbunden mit Lobby ${lobbyId}`}
          </Text>
        </View>
      )}

      <Text style={{ fontSize: 22, color: "#fff", marginBottom: 10 }}>
        🔥 Lobby
      </Text>
      <Text style={{ color: "#fff" }}>👤 Spielername: {playerName}</Text>

      {/* Meldungen */}
      {message && (
        <Text
          style={{
            color: message.type === "error" ? "#ff4d4d" : "#00e676",
            marginTop: 10,
            textAlign: "center",
          }}
        >
          {message.text}
        </Text>
      )}

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
              marginTop: 20,
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
