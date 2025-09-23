import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native";

export default function Index() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#1a0033", "#000000"]}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text style={{ fontSize: 28, color: "#fff", marginBottom: 40 }}>
        🔥 Yu-Gi-Oh! Trinkspiel
      </Text>

      <TouchableOpacity
        style={{
          backgroundColor: "#3A9D8E", // Magie-Farbe
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: 14,
          shadowColor: "#000",
          shadowOpacity: 0.4,
          shadowOffset: { width: 2, height: 4 },
          shadowRadius: 6,
          elevation: 6, // Android-Schatten
        }}
        onPress={() => router.push("/lobby")}
      >
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
          ➡️ Lobby betreten
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}
