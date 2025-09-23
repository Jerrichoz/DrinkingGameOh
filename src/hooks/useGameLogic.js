import { useState } from "react";
import { magics } from "../utils/magicCards";
import { monsters } from "../utils/monsterCards";
import { traps } from "../utils/trapCards";

export function useGameLogic() {
  const players = [
    {
      id: 1,
      name: "Player 1 (Me)",
      monster: monsters[0],
      trap: traps[0],
      isMe: true,
    },
    { id: 2, name: "P2", monster: monsters[1], trap: traps[1] },
    { id: 3, name: "P3", monster: monsters[2], trap: traps[2] },
    { id: 4, name: "P4", monster: monsters[0], trap: traps[1] },
    { id: 5, name: "P5", monster: monsters[1], trap: traps[2] },
  ];

  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardPress = (player, card, type) => {
    if (type === "trap" && !player.isMe) return; // nur eigene Falle klickbar
    setSelectedCard({ ...card, type });
  };

  const handleDrawMagic = () => {
    const randomMagic = magics[Math.floor(Math.random() * magics.length)];
    setSelectedCard({ ...randomMagic, type: "magic" });
  };

  return {
    players,
    selectedCard,
    setSelectedCard,
    handleCardPress,
    handleDrawMagic,
  };
}
