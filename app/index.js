import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';

export default function Start() {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleJoin = () => {
    if (name.trim().length > 0) {
      // Name als Parameter an die Lobby weitergeben
      router.push({ pathname: '/lobby', params: { playerName: name } });
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 }}>
      <Text style={{ fontSize: 24 }}>Yu-Gi-Oh! Trinkspiel 🍻</Text>

      <TextInput
        placeholder="Dein Spielername"
        value={name}
        onChangeText={setName}
        style={{
          borderWidth: 1,
          borderColor: '#aaa',
          padding: 10,
          width: 200,
          textAlign: 'center',
        }}
      />

      <Button title="Lobby beitreten" onPress={handleJoin} />
    </View>
  );
}
