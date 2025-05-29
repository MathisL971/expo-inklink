import ThemedNavBar from "@/components/ThemedNavBar";
import { ColorSchemeProvider } from "@/contexts/ColorSchemeContext";
import "@/global.css";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, View } from "react-native";
import "react-native-reanimated";

const queryClient = new QueryClient();

export default function RootWrapper() {
  return (
    <ColorSchemeProvider>
      <QueryClientProvider client={queryClient}>
        <RootLayout />
      </QueryClientProvider>
    </ColorSchemeProvider>
  );
}

function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ClerkProvider tokenCache={tokenCache}>
      <View className="min-h-full">
        {Platform.OS === "web" && <ThemedNavBar />}
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </View>
    </ClerkProvider>
  );
}
