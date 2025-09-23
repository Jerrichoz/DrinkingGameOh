import { useState } from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import Card from "../src/components/Card";
import { magics } from "../src/utils/magicCards";
import { monsters } from "../src/utils/monsterCards";
import { traps } from "../src/utils/trapCards";

export default function Game() {
  // Beispiel-Spieler (später aus Lobby dynamisch)
  const players = [
    {
      id: 1,
      name: "Player 1 (Me)",
      monster: monsters[0],
      trap: traps[0],
      isMe: true,
    },
    { id: 2, name: "P2", monster: monsters[1], trap: traps[1] },
    { id: 3, name: "P3", monster: monsters[2], trap: traps[2] },
    { id: 4, name: "P4", monster: monsters[0], trap: traps[1] },
    { id: 5, name: "P5", monster: monsters[1], trap: traps[2] },
  ];

  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardPress = (player, card, type) => {
    if (type === "trap" && !player.isMe) return; // nur eigene Falle klickbar
    setSelectedCard({ ...card, type });
  };

  // Magiekarte ziehen
  const handleDrawMagic = () => {
    const randomMagic = magics[Math.floor(Math.random() * magics.length)];
    setSelectedCard({ ...randomMagic, type: "magic" });
  };

  // Fallen-Karten UI (immer Rückseite)
  const TrapCard = ({ player }) => (
    <TouchableOpacity
      onPress={() => handleCardPress(player, player.trap, "trap")}
    >
      <Image
        source={require("../assets/card_back.png")}
        style={{ width: 50, height: 80, resizeMode: "cover", marginTop: 5 }}
      />
    </TouchableOpacity>
  );

  // Monster-Karten UI (zeigen Bild in klein)
  const MonsterCard = ({ player }) => (
    <TouchableOpacity
      onPress={() => handleCardPress(player, player.monster, "monster")}
    >
      <Image
        source={player.monster.image || require("../assets/default_card.png")}
        style={{ width: 50, height: 80, resizeMode: "cover" }}
      />
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "space-between",
        padding: 20,
      }}
    >
      {/* Oberes Spielfeld */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: 40,
        }}
      >
        {players.slice(2, 4).map((p) => (
          <View key={p.id} style={{ alignItems: "center" }}>
            <MonsterCard player={p} />
            <TrapCard player={p} />
            <Text>{p.name}</Text>
          </View>
        ))}
      </View>

      {/* Linke Seite */}
      <View style={{ position: "absolute", left: 10, top: "40%" }}>
        {players.slice(1, 2).map((p) => (
          <View key={p.id} style={{ alignItems: "center" }}>
            <MonsterCard player={p} />
            <TrapCard player={p} />
            <Text>{p.name}</Text>
          </View>
        ))}
      </View>

      {/* Rechte Seite */}
      <View style={{ position: "absolute", right: 10, top: "40%" }}>
        {players.slice(4, 5).map((p) => (
          <View key={p.id} style={{ alignItems: "center" }}>
            <MonsterCard player={p} />
            <TrapCard player={p} />
            <Text>{p.name}</Text>
          </View>
        ))}
      </View>

      {/* Magie-Stapel in der Mitte */}
      <View style={{ alignItems: "center", marginBottom: 100 }}>
        <TouchableOpacity onPress={handleDrawMagic}>
          <Image
            source={require("../assets/card_back.png")}
            style={{ width: 70, height: 110, resizeMode: "cover" }}
          />
        </TouchableOpacity>
        <Text>✨ Magie-Stapel</Text>
      </View>

      {/* Eigener Bereich (unten) */}
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        {players.slice(0, 1).map((p) => (
          <View key={p.id} style={{ flexDirection: "row", gap: 10 }}>
            <MonsterCard player={p} />
            <TrapCard player={p} />
          </View>
        ))}
        <Text>Player 1 (Me)</Text>
      </View>

      {/* Modal für große Ansicht */}
      <Modal visible={!!selectedCard} transparent={true} animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.7)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card
            title={selectedCard?.name}
            effect={selectedCard?.effect}
            image={selectedCard?.image}
          />
          <TouchableOpacity
            onPress={() => setSelectedCard(null)}
            style={{ marginTop: 20 }}
          >
            <Text style={{ color: "#fff", fontSize: 18 }}>Schließen</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
