import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { fetchAllCards } from "../utils/cards";

// Hilfsfunktion: zufällige Karte
const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function useGameFirebase(lobbyId, playerName) {
  const [lobby, setLobby] = useState(null);
  const [monsters, setMonsters] = useState([]);
  const [traps, setTraps] = useState([]);
  const [magics, setMagics] = useState([]);

  const lobbyRef = doc(db, "lobbies", lobbyId);

  // Karten aus CSV laden (einmalig)
  useEffect(() => {
    async function loadCards() {
      const all = await fetchAllCards();
      setMonsters(all.filter((c) => c.type === "monster"));
      setTraps(all.filter((c) => c.type === "trap"));
      setMagics(all.filter((c) => c.type === "magic"));
    }
    loadCards();
  }, []);

  // Live-Updates der Lobby
  useEffect(() => {
    const unsub = onSnapshot(lobbyRef, (snap) => {
      if (snap.exists()) setLobby(snap.data());
    });
    return unsub;
  }, [lobbyId]);

  // Spieler beitreten (falls noch nicht drin)
  useEffect(() => {
    async function join() {
      const snap = await getDoc(lobbyRef);
      if (snap.exists()) {
        const data = snap.data();
        const already = data.players.find((p) => p.name === playerName);

        if (!already && monsters.length > 0 && traps.length > 0) {
          await updateDoc(lobbyRef, {
            players: arrayUnion({
              id: Date.now().toString(),
              name: playerName,
              monster: random(monsters),
              trap: random(traps),
              shots: 0,
              ready: false,
              isHost: false,
            }),
          });
        }
      }
    }
    join();
  }, [playerName, monsters, traps]);

  // Magiekarte ziehen
  const drawMagic = async () => {
    if (!lobby || magics.length === 0) return;

    const newMagic = random(magics);
    await updateDoc(lobbyRef, {
      lastMagic: newMagic,
      turn: (lobby.turn + 1) % lobby.players.length, // nächster Spieler
    });
  };

  return { lobby, drawMagic };
}
