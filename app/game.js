import { LinearGradient } from "expo-linear-gradient";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import Card from "../src/components/Card";
import { useGameLogic } from "../src/hooks/useGameLogic";
import { gameStyles } from "../src/styles/gameStyles";

export default function Game() {
  const {
    players,
    selectedCard,
    setSelectedCard,
    handleCardPress,
    handleDrawMagic,
  } = useGameLogic();

  const TrapCard = ({ player }) => (
    <TouchableOpacity
      onPress={() => handleCardPress(player, player.trap, "trap")}
    >
      <Image
        source={require("../assets/card_back.png")}
        style={gameStyles.trapImage}
      />
    </TouchableOpacity>
  );

  const MonsterCard = ({ player }) => (
    <TouchableOpacity
      onPress={() => handleCardPress(player, player.monster, "monster")}
    >
      <Image
        source={player.monster.image || require("../assets/default_card.png")}
        style={gameStyles.cardImage}
      />
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={["#1a0033", "#000000"]}
      style={gameStyles.container}
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
            <Text style={gameStyles.playerName}>{p.name}</Text>
          </View>
        ))}
      </View>

      {/* Linke Seite */}
      <View style={{ position: "absolute", left: 10, top: "40%" }}>
        {players.slice(1, 2).map((p) => (
          <View key={p.id} style={{ alignItems: "center" }}>
            <MonsterCard player={p} />
            <TrapCard player={p} />
            <Text style={gameStyles.playerName}>{p.name}</Text>
          </View>
        ))}
      </View>

      {/* Rechte Seite */}
      <View style={{ position: "absolute", right: 10, top: "40%" }}>
        {players.slice(4, 5).map((p) => (
          <View key={p.id} style={{ alignItems: "center" }}>
            <MonsterCard player={p} />
            <TrapCard player={p} />
            <Text style={gameStyles.playerName}>{p.name}</Text>
          </View>
        ))}
      </View>

      {/* Magie-Stapel in der Mitte */}
      <View style={gameStyles.magicStack}>
        <TouchableOpacity onPress={handleDrawMagic}>
          <Image
            source={require("../assets/card_back.png")}
            style={{ width: 70, height: 110, resizeMode: "cover" }}
          />
        </TouchableOpacity>
        <Text style={{ color: "#fff" }}>✨ Magie-Stapel</Text>
      </View>

      {/* Eigener Bereich */}
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        {players.slice(0, 1).map((p) => (
          <View key={p.id} style={{ flexDirection: "row", gap: 10 }}>
            <MonsterCard player={p} />
            <TrapCard player={p} />
          </View>
        ))}
        <Text style={gameStyles.playerName}>Player 1 (Me)</Text>
      </View>

      {/* Modal */}
      <Modal visible={!!selectedCard} transparent={true} animationType="fade">
        <View style={gameStyles.modalContainer}>
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
    </LinearGradient>
  );
}
