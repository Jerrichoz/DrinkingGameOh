import { Image, Modal, Text, TouchableOpacity, View } from "react-native";

export default function MagicCardModal({
  lobby,
  me,
  isMyTurn,
  selectedCard,
  setSelectedCard,
  handleShow,
  handleDiscard,
  handleDrink,
  handleActivateEffect,
}) {
  const card = selectedCard || lobby.lastMagic;

  // Modal sichtbar für: 1) Zugspieler wenn er zieht 2) alle wenn Show gedrückt wurde
  const visible = !!card && (isMyTurn || lobby.showMagic);

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.85)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={card.image}
          style={{ width: 220, height: 320 }}
          resizeMode="cover"
        />
        <Text style={{ color: "#fff", marginTop: 10, fontSize: 20 }}>
          {card.name}
        </Text>
        <Text
          style={{
            color: "#fff",
            marginTop: 5,
            fontSize: 14,
            textAlign: "center",
            paddingHorizontal: 20,
          }}
        >
          {card.effect}
        </Text>

        {/* Nur Show für Zugspieler, wenn noch nicht gezeigt */}
        {isMyTurn && !lobby.showMagic && (
          <TouchableOpacity
            onPress={handleShow}
            style={{
              marginTop: 15,
              backgroundColor: "#D9C9A3",
              padding: 10,
              borderRadius: 8,
            }}
          >
            <Text>👁️ Show</Text>
          </TouchableOpacity>
        )}

        {/* Nach Show → alle sehen die Buttons */}
        {lobby.showMagic && (
          <>
            {/* Saufen (alle) */}
            <TouchableOpacity
              onPress={() => handleDrink(playerName)} // aktueller Spieler trinkt selbst
              style={{
                marginTop: 10,
                backgroundColor: "#D9C9A3",
                padding: 10,
                borderRadius: 8,
              }}
            >
              <Text>🍻 Trinken</Text>
            </TouchableOpacity>

            {/* Monster-Effekt */}
            {me?.monster && (
              <View style={{ marginTop: 15, alignItems: "center" }}>
                <Image
                  source={me.monster.image}
                  style={{ width: 80, height: 120 }}
                />
                <TouchableOpacity
                  onPress={() => handleActivateEffect(me.monster, "monster")}
                  style={{
                    marginTop: 5,
                    backgroundColor: "#d9c9a3",
                    padding: 5,
                    borderRadius: 6,
                  }}
                >
                  <Text>⚡ Aktivieren</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Fallen-Effekt */}
            {me?.trap && (
              <View style={{ marginTop: 15, alignItems: "center" }}>
                <Image
                  source={me.trap.image}
                  style={{ width: 80, height: 120 }}
                />
                <TouchableOpacity
                  onPress={() => handleActivateEffect(me.trap, "trap")}
                  style={{
                    marginTop: 5,
                    backgroundColor: "#d9c9a3",
                    padding: 5,
                    borderRadius: 6,
                  }}
                >
                  <Text>⚡ Aktivieren</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Ablegen nur für Zugspieler */}
            {isMyTurn && (
              <TouchableOpacity
                onPress={handleDiscard}
                style={{
                  marginTop: 20,
                  backgroundColor: "#d98c8c",
                  padding: 10,
                  borderRadius: 8,
                }}
              >
                <Text>🗑️ Magiekarte ablegen</Text>
              </TouchableOpacity>
            )}
          </>
        )}
        {lobby.activeEffect && lobby.votingOpen && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.8)",
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
            }}
          >
            <Image
              source={lobby.activeEffect.card.image}
              style={{ width: 200, height: 300 }}
              resizeMode="cover"
            />
            <Text style={{ color: "#fff", marginTop: 10, fontSize: 18 }}>
              {lobby.activeEffect.card.name}
            </Text>
            <Text style={{ color: "#fff", marginTop: 10, fontSize: 16 }}>
              Passt die Aktivierung des Effekts?
            </Text>

            <View style={{ flexDirection: "row", marginTop: 20 }}>
              <TouchableOpacity
                onPress={() => handleVote("ja")}
                style={{
                  backgroundColor: "#1b5e20",
                  padding: 10,
                  borderRadius: 8,
                  marginHorizontal: 10,
                }}
              >
                <Text style={{ color: "#fff" }}>Ja ✅</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleVote("nein")}
                style={{
                  backgroundColor: "#b71c1c",
                  padding: 10,
                  borderRadius: 8,
                  marginHorizontal: 10,
                }}
              >
                <Text style={{ color: "#fff" }}>Nein ❌</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Modal schließen */}
        <TouchableOpacity
          onPress={() => setSelectedCard(null)}
          style={{
            marginTop: 20,
            padding: 10,
            backgroundColor: "#D9C9A3",
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "#000" }}>Schließen</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
