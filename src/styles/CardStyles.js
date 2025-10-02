import { StyleSheet } from "react-native";

export const cardStyles = StyleSheet.create({
  cardTemplate: {
    width: 320,
    height: 550,
    margin: 10,
    zIndex: 1,
  },

  // Titel im oberen Balken
  cardTitle: {
    position: "absolute",
    top: 27,
    left: 20,
    right: 40, // Platz für Sterne rechts lassen
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    textAlign: "left",
    numberOfLines: 1, // verhindert Zeilenumbruch
  },

  // Sterne rechts vom Titel
  starLevel: {
    position: "absolute",
    top: 65,
    right: 30,
    width: 25,
    height: 25,
    zIndex: 3,
  },

  // Bild exakt im schwarzen Fenster
  imageBox: {
    position: "absolute",
    top: 95,
    left: 34,
    right: 34,
    width: 250,
    height: 295,
    zIndex: 99,
  },

  // Typ-Leiste (unter Bild, vor Effekt)
  typeLabel: {
    position: "absolute",
    top: 410,
    left: 25,
    right: 20,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "left",
  },

  // Beschreibung unten im Textfeld
  monsterDescription: {
    position: "absolute",
    top: 430,
    left: 28,
    right: 20,
    bottom: 40, // Platz für ATK/DEF lassen
    fontSize: 12,
    lineHeight: 16,
    color: "#000",
    textAlign: "left",
    backgroundColor: "transparent",
    zIndex: 3,
  },

  // ATK/DEF ganz unten rechts
  monsterAtk: {
    position: "absolute",
    bottom: 13,
    right: 80,
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },
  monsterDef: {
    position: "absolute",
    bottom: 13,
    right: 20,
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },
});
