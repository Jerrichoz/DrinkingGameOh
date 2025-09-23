import { StyleSheet } from "react-native";

export const gameStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
  },
  playerName: {
    color: "#fff",
    marginTop: 4,
  },
  cardImage: {
    width: 50,
    height: 80,
    resizeMode: "cover",
  },
  trapImage: {
    width: 50,
    height: 80,
    resizeMode: "cover",
    marginTop: 5,
  },
  magicStack: {
    alignItems: "center",
    marginBottom: 100,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
});
