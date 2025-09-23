import { Image, Text, View } from 'react-native';

export default function Card({ title, image, effect }) {
  // Default-Bild fallback
  const cardImage = image ? image : require('../../assets/default_card.png');

  return (
    <View
      style={{
        width: 250,
        height: 360,
        borderWidth: 2,
        borderColor: '#654321',
        borderRadius: 8,
        backgroundColor: '#f5deb3',
        overflow: 'hidden',
      }}
    >
      {/* Titel */}
      <View style={{ backgroundColor: '#c9a66b', padding: 6 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{title}</Text>
      </View>

      {/* Bild */}
      <View
        style={{
          backgroundColor: '#fff',
          margin: 6,
          height: 180,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          source={cardImage}
          style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
        />
      </View>

      {/* Effekttext */}
      <View
        style={{
          flex: 1,
          backgroundColor: '#fdf5e6',
          margin: 6,
          padding: 6,
          borderWidth: 1,
          borderColor: '#ccc',
        }}
      >
        <Text style={{ fontSize: 12 }}>{effect}</Text>
      </View>
    </View>
  );
}
