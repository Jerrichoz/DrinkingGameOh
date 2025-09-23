// src/utils/trapCards.js
const baseTraps = [
  {
    name: "Spiegelkraft",
    effect: "Wenn nur du trinken musst → alle anderen trinken.",
    image: require("../../assets/images/trapimgs/mirror_force.png"),
  },
  {
    name: "Fallgrube",
    effect: "Wenn ein Gegner sein Monster benutzt → Effekt negiert.",
    image: require("../../assets/images/trapimgs/trap_hole.png"),
  },
  {
    name: "Magischer Zylinder",
    effect: "Wenn jemand dich trinken lässt → Effekt zurück.",
    image: require("../../assets/images/trapimgs/magic_cylinder.png"),
  },
];
// beim Export automatisch type hinzufügen
export const traps = baseTraps.map((c) => ({ ...c, type: "trap" }));
