// src/utils/cards.js

export const monsters = [
  {
    name: "Dunkler Magier",
    effect: "Zieh eine neue Falle, wenn dir deine nicht gefällt.",
    image: require('../../assets/dark_magician.png'),
  },
  {
    name: "Blauäugiger Drache",
    effect: "Gib einen Schluck ab, wenn du trinken musst.",
    //image: require('../../assets/blue_eyes.png'),
  },
  {
    name: "Kuriboh 2",
    effect: "Einmal darfst du komplett aussetzen.",
    //image: require('../../assets/kuriboh.png'),
  }
];


export const traps = [
  {
    name: "Spiegelkraft",
    effect: "Wenn nur du trinken musst → alle anderen trinken."
  },
  {
    name: "Fallgrube",
    effect: "Wenn ein Gegner sein Monster benutzt → Effekt negiert."
  },
  {
    name: "Magischer Zylinder",
    effect: "Wenn jemand dich trinken lässt → Effekt zurück."
  }
];

export const magics = [
  {
    name: "Topf der Gier",
    effect: "Verteile zwei Schlücke."
  },
  {
    name: "Schwarzes Loch",
    effect: "Alle außer dir trinken."
  },
  {
    name: "Change of Heart",
    effect: "Bestimme einen Spieler, der für dich trinken muss."
  },
    {
    name: "Zwangsevakuierungsgerät",
    effect: "Der letzte Spieler muss nochmal trinken."
  }
];
