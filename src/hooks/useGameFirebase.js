import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { magics } from "../utils/magicCards";
import { monsters } from "../utils/monsterCards";
import { traps } from "../utils/trapCards";

// Hilfsfunktion: zufällige Karte
const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function useGameFirebase(lobbyId, playerName) {
  const [lobby, setLobby] = useState(null);
  const lobbyRef = doc(db, "lobbies", lobbyId);

  // Live-Updates der Lobby
  useEffect(() => {
    const unsub = onSnapshot(lobbyRef, (snap) => {
      if (snap.exists()) setLobby(snap.data());
    });
    return unsub;
  }, [lobbyId]);

  // Spieler beitreten (falls noch nicht drin)
  useEffect(() => {
    const join = async () => {
      const snap = await getDoc(lobbyRef);
      if (snap.exists()) {
        const data = snap.data();
        const already = data.players.find((p) => p.name === playerName);
        if (!already) {
          await updateDoc(lobbyRef, {
            players: arrayUnion({
              id: Date.now().toString(),
              name: playerName,
              monster: random(monsters),
              trap: random(traps),
            }),
          });
        }
      }
    };
    join();
  }, [playerName]);

  // Magiekarte ziehen
  const drawMagic = async () => {
    const newMagic = random(magics);
    await updateDoc(lobbyRef, {
      lastMagic: newMagic,
      turn: (lobby.turn + 1) % lobby.players.length, // nächster Spieler
    });
  };

  return { lobby, drawMagic };
}
