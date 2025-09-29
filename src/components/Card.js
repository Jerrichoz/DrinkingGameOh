import { Image, Text, View } from "react-native";
import { cardStyles } from "../styles/CardStyles";

export default function Card({
  title = "Mystischer-Raum-Cocktail",
  description = "Wähle drei Getränke deiner Wahl und mixe sie zu einem Cocktail. Wähle zwei Mitspieler, die den Cocktail innerhalb von drei Runden auftrinken müssen.",
  atk = 1500,
  def = 1200,
  type = "magic", // "magic" | "trap" | "monster"
  stars = 4,
  monsterType = "[Hexer / Effekt]",
  imageUri = "https://jerrichoz.github.io/DrinkingGameOh/assets/images/cards/cocktail.png",
}) {
  const typeStyles = {
    magic: {
      frame: "#00796B",
      label: "[ZAUBERKARTE]",
    },
    trap: {
      frame: "#8B3A62",
      label: "[FALLENKARTE]",
    },
    monster: {
      frame: "#C9A66B",
      label: monsterType,
    },
  };

  const current = typeStyles[type];

  return (
    <View style={[cardStyles.cardTemplate, { borderColor: current.frame }]}>
      {/* Kartenrahmen */}
      <View style={[cardStyles.cardFace, { borderColor: current.frame }]} />

      {/* Titel */}
      <Text style={cardStyles.cardTitle}>{title}</Text>

      {/* Sterne (nur für Monsterkarten) */}
      {type === "monster" &&
        [...Array(stars)].map((_, i) => (
          <Image
            key={i}
            source={{
              uri: "https://jerrichoz.github.io/DrinkingGameOh/assets/images/star.png",
            }}
            style={[cardStyles.starLevel, { left: 340 - i * 25 }]}
          />
        ))}

      {/* Typ-Leiste */}
      <Text style={cardStyles.typeLabel}>{current.label}</Text>

      {/* Bild */}
      <Image source={{ uri: imageUri }} style={cardStyles.imageBox} />

      {/* Beschreibung */}
      <Text style={cardStyles.monsterDescription}>{description}</Text>

      {/* ATK/DEF (nur bei Monsterkarten) */}
      {type === "monster" && (
        <>
          <Text style={cardStyles.monsterAtk}>ATK/{atk}</Text>
          <Text style={cardStyles.monsterDef}>DEF/{def}</Text>
        </>
      )}
    </View>
  );
}
