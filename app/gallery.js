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
import { fetchAllCards } from "../src/utils/cards"; // <- hierher ausgelagert

export default function Gallery() {
  const router = useRouter();
  const [selectedCard, setSelectedCard] = useState(null);
  const [allCards, setAllCards] = useState([]);

  async function refreshCards() {
    const cards = await fetchAllCards();
    setAllCards(cards);
  }

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

      {/* Button: Karten aktualisieren */}
      <TouchableOpacity
        onPress={refreshCards}
        style={{
          backgroundColor: "#444",
          padding: 10,
          margin: 10,
          borderRadius: 8,
          alignSelf: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16 }}>
          🔄 Karten aktualisieren
        </Text>
      </TouchableOpacity>

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
              source={card.image}
              style={{ width: 80, height: 120, resizeMode: "cover" }}
              onError={(e) =>
                console.warn(
                  "❌ Bild konnte nicht geladen werden:",
                  card.image,
                  e.nativeEvent.error
                )
              }
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
            type={selectedCard?.type}
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
