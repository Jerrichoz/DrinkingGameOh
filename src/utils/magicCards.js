// src/utils/magicCards.js
const baseMagics = [
  {
    name: "Topf der Gier",
    effect: "Verteile zwei Schlücke.",
    image: require("../../assets/images/magicimgs/pot_of_greed.png"),
  },
  {
    name: "Schwarzes Loch",
    effect:
      "Alle Mosnter verschwinden vom Spielfeld. Jeder zieht ein neues Monster und dafür auch einen trinken.",
    image: require("../../assets/images/magicimgs/black_hole.png"),
  },
  {
    name: "Überläufer",
    effect:
      "Such ein Spieler aus, jedes mal wenn er trinken muss, trinkst du einen. Wenn aber du trinken musst, trinkt er einen.",
    image: require("../../assets/images/magicimgs/change_of_heart.png"),
  },
  {
    name: "Gemeinsam sind wir nass!",
    effect: "Pro Anzal der Gesamtspieler, trinkt jeder einen kurzen.",
    image: require("../../assets/images/magicimgs/united_we_stand.png"),
  },
];
export const magics = baseMagics.map((c) => ({ ...c, type: "magic" }));
