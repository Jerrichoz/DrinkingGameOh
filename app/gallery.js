import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Card from "../src/components/Card";
import { magics } from "../src/utils/magicCards";
import { monsters } from "../src/utils/monsterCards";
import { traps } from "../src/utils/trapCards";

export default function Gallery() {
  const router = useRouter();
  const [selectedCard, setSelectedCard] = useState(null);

  // Alle Karten mit Typ (kommt schon aus utils)
  const allCards = [...monsters, ...magics, ...traps];

  return (
    <View style={{ flex: 1, backgroundColor: "#111" }}>
      <Text
        style={{
          color: "#fff",
          fontSize: 22,
          textAlign: "center",
          marginTop: 20,
        }}
      >
        📖 Karten-Galerie
      </Text>

      <ScrollView
        contentContainerStyle={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          padding: 10,
        }}
      >
        {allCards.map((card, index) => (
          <TouchableOpacity
            key={index}
            style={{ margin: 8 }}
            onPress={() => setSelectedCard(card)}
          >
            <Image
              source={card.image || require("../assets/default_card.png")}
              style={{ width: 80, height: 120, resizeMode: "cover" }}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal */}
      <Modal visible={!!selectedCard} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.8)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card
            title={selectedCard?.name}
            effect={selectedCard?.effect}
            image={selectedCard?.image}
            type={selectedCard?.type} // <- wichtig
          />
          <TouchableOpacity
            onPress={() => setSelectedCard(null)}
            style={{ marginTop: 20 }}
          >
            <Text style={{ color: "#fff", fontSize: 18 }}>Schließen</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Zurück */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ position: "absolute", top: 40, left: 20 }}
      >
        <Text style={{ color: "#fff", fontSize: 18 }}>← Zurück</Text>
      </TouchableOpacity>
    </View>
  );
}
