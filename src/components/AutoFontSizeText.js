import { useState } from "react";
import { Text, View } from "react-native";

export default function AutoFontSizeText({
  children,
  style,
  minFontSize = 16,
  maxFontSize = 24,
}) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const text = String(children);
  let fontSize = maxFontSize;

  if (containerWidth > 0 && containerHeight > 0 && text.length > 0) {
    fontSize = Math.sqrt((containerWidth * containerHeight) / text.length);
    fontSize = Math.max(minFontSize, Math.min(fontSize, maxFontSize));
  }

  return (
    <View
      style={{ flexDirection: "row" }}
      onLayout={(e) => {
        setContainerWidth(e.nativeEvent.layout.width);
        setContainerHeight(e.nativeEvent.layout.height);
      }}
    >
      <Text style={[style, { fontSize }]} numberOfLines={1}>
        {children}
      </Text>
    </View>
  );
}
