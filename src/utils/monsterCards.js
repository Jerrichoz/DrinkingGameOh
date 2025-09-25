// Images importieren
import blueEyesImg from "../../assets/images/monsterimgs/blue_eyes.png";
import darkMagicianImg from "../../assets/images/monsterimgs/dark_magician.png";
import kuribohImg from "../../assets/images/monsterimgs/kuriboh.png";
import zorcImg from "../../assets/images/monsterimgs/zorc.png";

const baseMonsters = [
  {
    name: "Dunkler Magier",
    effect: "Zieh eine neue Falle, wenn dir deine nicht gefällt.",
    image: darkMagicianImg,
  },
  {
    name: "Blauäugiger Drache",
    effect: "Gib einen Schluck ab, wenn du trinken musst.",
    image: blueEyesImg,
  },
  {
    name: "Kuriboh",
    effect: "Einmal darfst du komplett aussetzen.",
    image: kuribohImg,
  },
  {
    name: "Großmeister Jörg",
    effect:
      "Einmal pro Runde, kannst du würfeln. Bei einer 1,2 müssen alle einen trinken. Bei einer 3,4 kannst du dir einen aussuchen, der trinkt. Bei einer 5 musst du einen trinken. Bei einer 6 müssen alle, außer du einen trinken.",
    image: zorcImg,
  },
];

export const monsters = baseMonsters.map((c) => ({ ...c, type: "monster" }));
