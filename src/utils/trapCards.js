// Images importieren
import magicCylinderImg from "../../assets/images/trapimgs/magic_cylinder.png";
import mirrorForceImg from "../../assets/images/trapimgs/mirror_force.png";
import trapHoleImg from "../../assets/images/trapimgs/trap_hole.png";

const baseTraps = [
  {
    name: "Spiegelkraft",
    effect: "Wenn nur du trinken musst → alle anderen trinken.",
    image: mirrorForceImg,
  },
  {
    name: "Fallgrube",
    effect: "Wenn ein Gegner sein Monster benutzt → Effekt negiert.",
    image: trapHoleImg,
  },
  {
    name: "Magischer Zylinder",
    effect: "Wenn jemand dich trinken lässt → Effekt zurück.",
    image: magicCylinderImg,
  },
];

export const traps = baseTraps.map((c) => ({ ...c, type: "trap" }));
