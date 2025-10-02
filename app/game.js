import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import { db } from "../firebaseConfig";
import Card from "../src/components/Card";
import VotePanel from "../src/components/VotePanel";
import { gameStyles } from "../src/styles/gameStyles";
import { randomMagic, randomMonster, randomTrap } from "../src/utils/gameLogic";

// Beispiel: Spieler joinen und erhalten Startkarten
const handleJoinGame = async (playerName) => {
  const monster = await randomMonster();
  const trap = await randomTrap();

  await updateDoc(lobbyRef, {
    players: [
      ...lobby.players,
      {
        id: Date.now().toString(),
        name: playerName,
        monster,
        trap,
        shots: 0,
      },
    ],
  });
};

export default function Game() {
  const { lobbyId, playerName } = useLocalSearchParams();

  // --- States ---
  const [lobby, setLobby] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null); // Karte für vergrößerte Ansicht im Modal

  const lobbyRef = doc(db, "lobbies", lobbyId);

  // --- Live-Updates der Lobby ---
  useEffect(() => {
    if (!lobbyId) return;

    const unsub = onSnapshot(lobbyRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();

        // fallback damit nichts crasht wenn ein Feld fehlt
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
      const newMagic = await randomMagic(); // 👈 jetzt async!
      console.log("[DRAW] Neue Karte:", newMagic);

      await updateDoc(lobbyRef, {
        lastMagic: newMagic,
        showMagic: false,
      });

      // Karte sofort im Modal für mich anzeigen
      setSelectedCard({ ...newMagic, type: "MAGIC" });
    } catch (err) {
      console.error("[DRAW ERROR]", err);
    }
  };

  // --- Karte zeigen (für alle Spieler sichtbar) ---
  const handleShow = async () => {
    try {
      if (!lobby?.lastMagic) return;
      console.log("[SHOW] Karte aufgedeckt:", lobby.lastMagic);

      await updateDoc(lobbyRef, { showMagic: true });
    } catch (err) {
      console.error("[SHOW ERROR]", err);
    }
  };

  // --- Karte ablegen & nächster Spieler ist dran ---
  const handleDiscard = async () => {
    if (!lobby) return;
    try {
      const discardPile = [...(lobby.discardPile || []), lobby.lastMagic];
      const nextTurn = ((lobby.turn ?? 0) + 1) % (lobby.players?.length || 1);

      await updateDoc(lobbyRef, {
        discardPile,
        lastMagic: null,
        turn: nextTurn,
        showMagic: false,
      });
    } catch (err) {
      console.error("[DISCARD ERROR]", err);
    }
  };

  // --- Spieler trinken lassen ---
  const handleDrink = async (targetPlayerName) => {
    if (!lobby) return;
    try {
      const updatedPlayers = lobby.players.map((p) =>
        p.name === targetPlayerName ? { ...p, shots: (p.shots || 0) + 1 } : p
      );

      await updateDoc(lobbyRef, { players: updatedPlayers });

      console.log(`[DRINK] ${targetPlayerName} hat einen Kurzen getrunken 🍻`);
    } catch (err) {
      console.error("[DRINK ERROR]", err);
    }
  };
  // --- Effekt aktivieren ---
  const handleActivateEffect = async (card, sourcePlayer) => {
    if (!lobby) return;
    try {
      const effectData = {
        player: sourcePlayer,
        card,
      };

      await updateDoc(lobbyRef, {
        activeEffect: effectData,
        votes: { ja: [], nein: [] },
        votingOpen: true,
      });

      console.log(`[EFFECT] ${sourcePlayer} aktiviert ${card.name}`);
    } catch (err) {
      console.error("[EFFECT ERROR]", err);
    }
  };
  // --- Abstimmung abgeben ---
  const handleVote = async (vote) => {
    if (!lobby || !lobby.activeEffect || !lobby.votingOpen) return;

    try {
      const votes = lobby.votes || { ja: [], nein: [] };

      // prüfen ob Spieler schon abgestimmt hat
      if (votes.ja.includes(playerName) || votes.nein.includes(playerName)) {
        console.log(`[VOTE] ${playerName} hat bereits abgestimmt`);
        return;
      }

      const updatedVotes = {
        ja: vote === "ja" ? [...votes.ja, playerName] : votes.ja,
        nein: vote === "nein" ? [...votes.nein, playerName] : votes.nein,
      };

      await updateDoc(lobbyRef, { votes: updatedVotes });

      console.log(`[VOTE] ${playerName} stimmt mit ${vote}`);

      // check ob alle abgestimmt haben
      if (
        updatedVotes.ja.length + updatedVotes.nein.length ===
        lobby.players.length
      ) {
        const jaCount = updatedVotes.ja.length;
        const neinCount = updatedVotes.nein.length;

        let updates = { votingOpen: false };

        if (jaCount > neinCount) {
          console.log("[VOTE RESULT] Mehrheit Ja → Effekt gültig");
          updates.voteResult = "✅ Effekt wurde bestätigt!";
        } else if (neinCount > jaCount) {
          console.log("[VOTE RESULT] Mehrheit Nein → Spieler muss trinken");
          updates.voteResult = `❌ Effekt abgelehnt! ${lobby.activeEffect.player} muss trinken 🍻`;

          const updatedPlayers = lobby.players.map((p) =>
            p.name === lobby.activeEffect.player
              ? { ...p, shots: (p.shots || 0) + 1 }
              : p
          );
          updates.players = updatedPlayers;
        } else {
          console.log("[VOTE RESULT] Gleichstand → nix passiert");
          updates.voteResult = "⚖️ Gleichstand – nix passiert.";
        }

        updates.activeEffect = null;
        updates.votes = { ja: [], nein: [] };

        await updateDoc(lobbyRef, updates);
      }
    } catch (err) {
      console.error("[VOTE ERROR]", err);
    }
  };

  // --- Ladebildschirm ---
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

  // --- Spielinfos ---
  const players = lobby.players || [];
  const me = players.find((p) => p.name === playerName);
  const others = players.filter((p) => p.name !== playerName);
  const isMyTurn = players[lobby.turn]?.name === playerName;

  return (
    <LinearGradient
      colors={["#1a0033", "#000000"]}
      style={gameStyles.container}
    >
      {/* Titel */}
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

      {/* Gegnerkarten (oben) */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginBottom: 40,
        }}
      >
        {others.map((p) => (
          <View
            key={p.id}
            style={{ alignItems: "center", marginHorizontal: 10 }}
          >
            {/* Monster + Falle nebeneinander */}
            <View style={{ flexDirection: "row" }}>
              {/* Monsterkarte → offen & klickbar */}
              {p.monster ? (
                <TouchableOpacity
                  onPress={() =>
                    setSelectedCard({ ...p.monster, type: "monster" })
                  }
                >
                  <Image
                    source={p.monster.image}
                    style={{ width: 60, height: 90, marginHorizontal: 5 }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ) : (
                <View style={{ width: 60, height: 90, marginHorizontal: 5 }} />
              )}

              {/* Fallenkarte → Gegner sieht nur Rückseite, NICHT klickbar */}
              {p.trap ? (
                <Image
                  source={require("../assets/images/card_back.png")}
                  style={{ width: 60, height: 90, marginHorizontal: 5 }}
                  resizeMode="cover"
                />
              ) : (
                <View style={{ width: 60, height: 90, marginHorizontal: 5 }} />
              )}
            </View>

            {/* Spielername darunter */}
            <Text style={{ color: "#fff", marginTop: 5 }}>{p.name}</Text>
          </View>
        ))}
      </View>

      {/* --- Magiestapel (Mitte) --- */}
      <View style={{ alignItems: "center", marginBottom: 40 }}>
        {/* Stapel-Karte */}
        <Image
          source={require("../assets/images/card_back.png")}
          style={{ width: 80, height: 120 }}
          resizeMode="cover"
        />
        <Text style={{ color: "#fff", marginTop: 5 }}>Magiestapel</Text>

        {/* Ziehen-Button nur wenn ich dran bin */}
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

        {/* Wenn es eine gezogene Karte gibt */}
        {lobby.lastMagic && (
          <View style={{ alignItems: "center", marginTop: 10 }}>
            {lobby.showMagic ? (
              <>
                <TouchableOpacity
                  onPress={() =>
                    setSelectedCard({ ...lobby.lastMagic, type: "magic" })
                  }
                >
                  <Card
                    title={lobby.lastMagic.title}
                    description={lobby.lastMagic.effect}
                    type="magic"
                    image={lobby.lastMagic.image}
                  />
                </TouchableOpacity>
                <Text style={{ color: "#fff", marginTop: 5 }}>
                  {lobby.lastMagic.title}
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
      {/* Modal für vergrößerte Karten */}
      {selectedCard && (
        <Modal visible={!!selectedCard} transparent animationType="fade">
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.8)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Card
              title={selectedCard.name}
              description={selectedCard.effect}
              atk={selectedCard.atk}
              def={selectedCard.def}
              type={selectedCard.type}
              stars={selectedCard.stars}
              monsterType={selectedCard.monsterType}
              image={selectedCard.image}
            />

            <TouchableOpacity
              onPress={() => setSelectedCard(null)}
              style={{
                marginTop: 20,
                padding: 10,
                backgroundColor: "#D9C9A3",
                borderRadius: 8,
              }}
            >
              <Text>Schließen</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}

      {/* --- Eigene Karten (unten) --- */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: "auto",
        }}
      >
        {/* Mein Monster (nur Bild anzeigen, komplette Karte erst im Modal) */}
        {me?.monster && (
          <TouchableOpacity
            onPress={() => setSelectedCard({ ...me.monster, type: "monster" })}
          >
            <Image
              source={me.monster.image}
              style={{ width: 100, height: 150, marginHorizontal: 10 }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}

        {/* Meine Falle (verdeckt, aber beim Klick wird vollständige Karte angezeigt) */}
        {me?.trap && (
          <TouchableOpacity
            onPress={() => setSelectedCard({ ...me.trap, type: "trap" })}
          >
            <Image
              source={require("../assets/images/card_back.png")}
              style={{ width: 100, height: 150, marginHorizontal: 10 }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
      </View>

      <Text style={{ color: "#fff", marginTop: 10, textAlign: "center" }}>
        {me?.name} (Du)
      </Text>

      {/* --- Modal für vergrößerte Karten (Monster, Falle, Magic) --- */}

      <VotePanel
        lobby={lobby}
        playerName={playerName}
        handleVote={handleVote}
      />
    </LinearGradient>
  );
}
