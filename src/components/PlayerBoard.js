import { Image, Text, TouchableOpacity, View } from "react-native";
import { gameStyles } from "../styles/gameStyles";

export default function PlayerBoard({ player, isCurrent, me, onSelectCard }) {
  return (
    <View style={{ alignItems: "center", margin: 10 }}>
      {/* Name */}
      <Text style={gameStyles.playerName}>
        {player.name} {isCurrent ? "⭐" : ""}
      </Text>

      {/* Karten nebeneinander */}
      <View style={{ flexDirection: "row", gap: 10 }}>
        {/* Monsterkarte: immer offen & klickbar */}
        <TouchableOpacity
          onPress={() =>
            player.monster &&
            onSelectCard({ ...player.monster, type: "monster" })
          }
        >
          <Image
            source={player.monster?.image}
            style={gameStyles.cardImageSmall}
            resizeMode="cover"
          />
        </TouchableOpacity>

        {/* Fallenkarte */}
        {player.name === me ? (
          <TouchableOpacity
            onPress={() =>
              player.trap && onSelectCard({ ...player.trap, type: "trap" })
            }
          >
            <Image
              source={player.trap?.image}
              style={gameStyles.cardImageSmall}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ) : (
          <Image
            source={require("../../assets/card_back.png")}
            style={gameStyles.cardImageSmall}
            resizeMode="cover"
          />
        )}
      </View>
    </View>
  );
}
