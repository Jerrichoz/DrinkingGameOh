import { Image, Text, TouchableOpacity, View } from "react-native";

export default function MagicStack({
  lobby,
  isMyTurn,
  onDraw,
  onShow,
  onDiscard,
}) {
  return (
    <View style={{ alignItems: "center", marginTop: 50 }}>
      <Image
        source={require("../../assets/card_back.png")}
        style={{ width: 90, height: 130, resizeMode: "cover" }}
        resizeMode="cover"
      />

      {/* Draw nur für aktuellen Spieler */}
      {isMyTurn && !lobby.lastMagic && (
        <TouchableOpacity
          onPress={onDraw}
          style={{
            marginTop: 12,
            backgroundColor: "#D9C9A3",
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: "#5C4033",
          }}
        >
          <Text style={{ color: "#2E1F12", fontWeight: "bold" }}>
            ✨ Ziehen
          </Text>
        </TouchableOpacity>
      )}

      {/* Show nur für aktuellen Spieler */}
      {isMyTurn && lobby.lastMagic && !lobby.showMagic && (
        <TouchableOpacity
          onPress={onShow}
          style={{
            marginTop: 12,
            backgroundColor: "#D9C9A3",
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: "#5C4033",
          }}
        >
          <Text style={{ color: "#2E1F12", fontWeight: "bold" }}>👁️ Show</Text>
        </TouchableOpacity>
      )}

      {/* Discard nur für aktuellen Spieler */}
      {isMyTurn && lobby.showMagic && (
        <TouchableOpacity
          onPress={onDiscard}
          style={{
            marginTop: 12,
            backgroundColor: "#D9C9A3",
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: "#5C4033",
          }}
        >
          <Text style={{ color: "#2E1F12", fontWeight: "bold" }}>
            📥 Ablegen
          </Text>
        </TouchableOpacity>
      )}

      <Text style={{ color: "#fff", marginTop: 10 }}>Magiestapel</Text>
    </View>
  );
}
