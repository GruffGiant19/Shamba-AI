import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Grift: require("../assets/fonts/grift-regular.otf"),
    "Grift-Bold": require("../assets/fonts/grift-bold.otf"),
    "Grift-ExtraLight": require("../assets/fonts/grift-extralight.otf"),
    "Grift-Light": require("../assets/fonts/grift-light.otf"),
    "Grift-Medium": require("../assets/fonts/grift-medium.otf"),
    "Grift-Black": require("../assets/fonts/grift-black.otf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
