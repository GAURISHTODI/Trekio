import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { CreateTripContext } from "../context/CreateTripContext";
import { useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "outfit": require("./../assets/fonts/Outfit-Regular.ttf"),
    "outfit-bold": require("./../assets/fonts/Outfit-Bold.ttf"),
    "outfit-medium": require("./../assets/fonts/Outfit-Medium.ttf"),
  });

  const [tripData, setTripData] = useState([]);

  // Prevent rendering until fonts are loaded
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <CreateTripContext.Provider value={{ tripData, setTripData }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </CreateTripContext.Provider>
  );
}
