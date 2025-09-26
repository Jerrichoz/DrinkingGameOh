import { useRouter } from "expo-router";
import Papa from "papaparse";
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

// 🔹 ID deines Default-Bildes in Google Drive
const DEFAULT_ID = "1Ewq8yJqYITcRE1jS7GIssy7_9EYi6zxY";

// Hilfsfunktion: Drive-ID in Direktlink umwandeln
function makeDriveUrl(fileId, cardName = "Unbekannt") {
  if (!fileId || fileId.trim() === "") {
    const url = `https://drive.google.com/uc?export=download&id=${DEFAULT_ID}`;
    console.log(`🖼️ [${cardName}] -> Default Bild genutzt: ${url}`);
    return url;
  }

  const url = `https://drive.google.com/uc?export=download&id=${fileId.trim()}`;
  console.log(`🖼️ [${cardName}] -> Drive Bild genutzt: ${url}`);
  return url;
}

// CSV-Parser
async function fetchCSV(url) {
  const res = await fetch(url);
  const text = await res.text();
  console.log("📥 CSV-Rohdaten:\n", text);

  const { data } = Papa.parse(text, { header: true });
  console.log("📊 Geparste Daten:", data);

  return data
    .filter((row) => row.name)
    .map((row) => {
      const imageUrl = makeDriveUrl(row.driveId, row.name);
      return {
        name: row.name.trim(),
        effect: row.effect?.trim(),
        image: { uri: imageUrl },
      };
    });
}

export default function Gallery() {
  const router = useRouter();
  const [selectedCard, setSelectedCard] = useState(null);
  const [allCards, setAllCards] = useState([]);

  async function refreshCards() {
    // ⚠️ Bitte die richtigen CSV-Export-Links mit "export?format=csv&gid=" einsetzen
    const monster = await fetchCSV(
      "https://docs.google.com/spreadsheets/d/1J8gaa-SfBALyJfnMOvBXKFuNe49AtfhfQFsNKqV_fjU/export?format=csv&gid=451899318"
    );
    const traps = await fetchCSV(
      "https://docs.google.com/spreadsheets/d/1J8gaa-SfBALyJfnMOvBXKFuNe49AtfhfQFsNKqV_fjU/export?format=csv&gid=1542620199"
    );
    const magics = await fetchCSV(
      "https://docs.google.com/spreadsheets/d/1J8gaa-SfBALyJfnMOvBXKFuNe49AtfhfQFsNKqV_fjU/export?format=csv&gid=1110294285"
    );

    setAllCards([...monster, ...traps, ...magics]);
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
