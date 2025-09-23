import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import Card from '../src/components/Card';
import { magics, monsters, traps } from '../src/utils/cards'; // alle Karten importieren

export default function Game() {
  const { playerName } = useLocalSearchParams();
  const router = useRouter();

  const [monster, setMonster] = useState(null);
  const [trap, setTrap] = useState(null);
  const [trapRevealed, setTrapRevealed] = useState(false);

  const [magicCard, setMagicCard] = useState(null); // letzte gezogene Magiekarte

  // Beim Start: Monster + Falle
  useEffect(() => {
    const randomMonster = monsters[Math.floor(Math.random() * monsters.length)];
    const randomTrap = traps[Math.floor(Math.random() * traps.length)];
    setMonster(randomMonster);
    setTrap(randomTrap);
  }, []);

  // Magiekarte ziehen
  const drawMagicCard = () => {
    const randomMagic = magics[Math.floor(Math.random() * magics.length)];
    setMagicCard(randomMagic);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16, padding: 20 }}>
      <Text style={{ fontSize: 22 }}>🎴 Game Screen</Text>
      <Text style={{ fontSize: 18 }}>Spieler: {playerName}</Text>

      {/* Monster immer sichtbar */}
        {monster && (
        <Card
            title={monster.name}
            image={monster.image} // später fügen wir hier Bilder hinzu
            effect={monster.effect}
        />
        )}

      {/* Falle */}
      {trap && (
        <View style={{ borderWidth: 1, borderColor: '#000', padding: 12, width: 250, backgroundColor: '#ffe6e6' }}>
          <Text style={{ fontWeight: 'bold' }}>🪤 Fallenkarte</Text>
          {trapRevealed ? (
            <>
              <Text>{trap.name}</Text>
              <Text style={{ fontSize: 12 }}>{trap.effect}</Text>
            </>
          ) : (
            <Text>❓ Verdeckt</Text>
          )}
        </View>
      )}

      <Button
        title={trapRevealed ? "Falle wieder verdecken" : "Falle ansehen"}
        onPress={() => setTrapRevealed(!trapRevealed)}
      />

      {/* Magiekarte ziehen */}
      <Button title="✨ Magiekarte ziehen" onPress={drawMagicCard} />

      {/* Gezogene Magiekarte anzeigen */}
      {magicCard && (
        <View style={{ borderWidth: 1, borderColor: '#000', padding: 12, width: 250, backgroundColor: '#e6ffe6' }}>
          <Text style={{ fontWeight: 'bold' }}>✨ Magiekarte</Text>
          <Text>{magicCard.name}</Text>
          <Text style={{ fontSize: 12 }}>{magicCard.effect}</Text>
        </View>
      )}

      <Button title="Zurück zur Lobby" onPress={() => router.push('/lobby')} />
    </View>
  );
}
