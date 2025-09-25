import { updateDoc } from "firebase/firestore";
import { Text, TouchableOpacity, View } from "react-native";

export default function EffectButtons({ lobby, playerName, lobbyRef }) {
  const handleActivate = async (type) => {
    if (lobby.effectInProgress) return; // Nur ein Effekt pro Zug
    await updateDoc(lobbyRef, {
      effectInProgress: { type, by: playerName },
      votes: {}, // reset Votes
    });
  };

  return (
    <View style={{ marginTop: 30, flexDirection: "row", gap: 10 }}>
      {/* Monster-Effekt */}
      <TouchableOpacity
        onPress={() => handleActivate("monster")}
        disabled={lobby.effectInProgress}
        style={{
          backgroundColor: lobby.effectInProgress ? "#777" : "#D9C9A3",
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: 8,
          borderWidth: 2,
          borderColor: "#5C4033",
        }}
      >
        <Text style={{ color: "#2E1F12", fontWeight: "bold" }}>🧙 Monster</Text>
      </TouchableOpacity>

      {/* Fallen-Effekt */}
      <TouchableOpacity
        onPress={() => handleActivate("trap")}
        disabled={lobby.effectInProgress}
        style={{
          backgroundColor: lobby.effectInProgress ? "#777" : "#D9C9A3",
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: 8,
          borderWidth: 2,
          borderColor: "#5C4033",
        }}
      >
        <Text style={{ color: "#2E1F12", fontWeight: "bold" }}>🪤 Falle</Text>
      </TouchableOpacity>
    </View>
  );
}
