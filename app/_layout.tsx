import ThemedNavBar from "@/components/ThemedNavBar";
import { ColorSchemeProvider } from "@/contexts/ColorSchemeContext";
import "@/global.css";
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from "react-native";
import 'react-native-reanimated';

export default function RootWrapper() {
   return (
    <ColorSchemeProvider>
      <RootLayout />
    </ColorSchemeProvider>
  );
}

function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ClerkProvider tokenCache={tokenCache}>
        { Platform.OS === 'web' && <ThemedNavBar />}
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
    </ClerkProvider>
  );
}

