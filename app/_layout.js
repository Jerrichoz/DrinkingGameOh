import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Layout() {
  const [fontsLoaded] = useFonts({
    DidactGothic: require("../assets/fonts/DidactGothic-Regular.ttf"),
  });

  if (!fontsLoaded) {
    // während die Schrift lädt
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Stack />;
}
