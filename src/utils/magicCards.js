// Images importieren
import blackHoleImg from "../../assets/images/magicimgs/black_hole.png";
import changeOfHeartImg from "../../assets/images/magicimgs/change_of_heart.png";
import potOfGreedImg from "../../assets/images/magicimgs/pot_of_greed.png";
import unitedWeStandImg from "../../assets/images/magicimgs/united_we_stand.png";

const baseMagics = [
  {
    name: "Topf der Gier",
    effect: "Verteile zwei Schlücke.",
    image: potOfGreedImg,
  },
  {
    name: "Schwarzes Loch",
    effect:
      "Alle Monster werden vernichtet. Jeder Spieler zieht ein neues Monster und dafür muss er auch einen trinken.",
    image: blackHoleImg,
  },
  {
    name: "Überläufer",
    effect:
      "Such ein Spieler aus, jedes mal wenn er trinken muss, trinkst du einen. Wenn aber du trinken musst, trinkt er einen.",
    image: changeOfHeartImg,
  },
  {
    name: "Gemeinsam sind wir nass!",
    effect: "Pro Anzal der Gesamtspieler, trinkt jeder einen kurzen.",
    image: unitedWeStandImg,
  },
];

export const magics = baseMagics.map((c) => ({ ...c, type: "magic" }));
