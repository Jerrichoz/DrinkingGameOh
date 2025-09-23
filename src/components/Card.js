import { Image, StyleSheet, Text, View } from "react-native";

export default function Card({ title, effect, image, type = "monster" }) {
  const typeColors = {
    monster: "#C9A66B",
    magic: "#3A9D8E",
    trap: "#8B3A62",
  };

  const cardColor = typeColors[type] || "#C9A66B";

  return (
    <View style={[styles.card, { borderColor: cardColor }]}>
      {/* Typ-Leiste oben */}
      <View style={[styles.typeRow, { backgroundColor: cardColor }]}>
        <Text style={styles.typeLabel}>
          {type === "magic"
            ? "[MAGIEKARTE]"
            : type === "trap"
            ? "[FALLENKARTE]"
            : "[MONSTER]"}
        </Text>
      </View>

      {/* Titel darunter, eigene Zeile */}
      <View style={styles.titleRow}>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Bild */}
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
  typeRow: {
    padding: 6,
    alignItems: "flex-end", // Typ immer rechts
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },
  titleRow: {
    paddingHorizontal: 6,
    paddingBottom: 4,
  },
  title: {
    fontSize: 16,
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
