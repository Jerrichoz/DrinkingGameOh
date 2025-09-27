import { useEffect, useState } from "react";
import { fetchAllCards } from "../utils/cards";

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function useGameLogic() {
  const [allCards, setAllCards] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  // Karten laden beim ersten Render
  useEffect(() => {
    async function load() {
      const cards = await fetchAllCards();
      setAllCards(cards);

      // Beispiel-Spieler erstellen (Demo-Modus)
      const monsters = cards.filter((c) => c.type === "MONSTER");
      const traps = cards.filter((c) => c.type === "TRAP");

      setPlayers([
        {
          id: 1,
          name: "Player 1 (Me)",
          monster: random(monsters),
          trap: random(traps),
          isMe: true,
        },
        {
          id: 2,
          name: "P2",
          monster: random(monsters),
          trap: random(traps),
        },
        {
          id: 3,
          name: "P3",
          monster: random(monsters),
          trap: random(traps),
        },
        {
          id: 4,
          name: "P4",
          monster: random(monsters),
          trap: random(traps),
        },
      ]);
    }
    load();
  }, []);

  // Karte anklicken
  const handleCardPress = (player, card, type) => {
    if (type === "trap" && !player.isMe) return; // nur eigene Falle klickbar
    setSelectedCard({ ...card, type });
  };

  // Magiekarte ziehen
  const handleDrawMagic = () => {
    const magics = allCards.filter((c) => c.type === "MAGIC");
    const randomMagic = random(magics);
    setSelectedCard({ ...randomMagic, type: "MAGIC" });
  };

  return {
    players,
    selectedCard,
    setSelectedCard,
    handleCardPress,
    handleDrawMagic,
  };
}
