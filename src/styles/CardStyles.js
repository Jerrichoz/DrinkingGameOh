import { StyleSheet } from "react-native";

export const cardStyles = StyleSheet.create({
  cardTemplate: {
    width: 320,
    height: 550,
    borderWidth: 8,
    borderRadius: 10,
    backgroundColor: "#c9c3af",
    overflow: "hidden",
    margin: 10,
  },

  cardFace: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 8,
    borderRadius: 10,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#d9c25f", // gold
    textAlign: "center",
    marginVertical: 6,
  },

  // Sterne
  starLevel: {
    position: "absolute",
    width: 22,
    top: 50,
  },

  typeLabel: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "bold",
    marginVertical: 4,
  },

  imageBox: {
    width: 280,
    height: 250,
    marginHorizontal: 20,
    borderWidth: 2,
    borderColor: "#333",
    backgroundColor: "#000",
  },

  monsterDescription: {
    fontSize: 13,
    margin: 10,
    backgroundColor: "#b2dfdb",
    borderWidth: 2,
    borderColor: "#e67e22",
    padding: 6,
  },

  monsterAtk: {
    position: "absolute",
    right: 70,
    bottom: 15,
    fontWeight: "bold",
  },
  monsterDef: {
    position: "absolute",
    right: 20,
    bottom: 15,
    fontWeight: "bold",
  },
});
