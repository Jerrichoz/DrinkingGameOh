import { Image, StyleSheet, Text, View } from "react-native";

export default function Card({ title, effect, image, type = "monster" }) {
  // Farben je nach Typ
  const typeColors = {
    monster: "#C9A66B", // braun/beige
    magic: "#3A9D8E", // grün/türkis
    trap: "#8B3A62", // lila/rot
  };

  const cardColor = typeColors[type] || "#C9A66B";

  return (
    <View style={[styles.card, { borderColor: cardColor }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: cardColor }]}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.typeLabel}>
          {type === "magic"
            ? "[MAGIEKARTE]"
            : type === "trap"
            ? "[FALLENKARTE]"
            : "[MONSTER]"}
        </Text>
      </View>

      {/* Bildbereich */}
      <View style={styles.imageContainer}>
        <Image
          source={image || require("../../assets/default_card.png")}
          style={styles.image}
        />
      </View>

      {/* Effekt-Text */}
      <View style={styles.effectBox}>
        <Text style={styles.effectText}>{effect}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 300,
    height: 420,
    borderWidth: 6,
    borderRadius: 8,
    backgroundColor: "#e6e0d4",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },
  imageContainer: {
    flex: 1,
    margin: 8,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  effectBox: {
    backgroundColor: "#f5f1e6",
    borderTopWidth: 1,
    borderColor: "#999",
    padding: 8,
  },
  effectText: {
    fontSize: 13,
    color: "#000",
  },
});
