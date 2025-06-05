import ThemedNavBar from "@/components/ThemedNavBar";
import { ThemedView } from "@/components/ThemedView";
import { Spinner } from "@/components/ui/spinner";
import { ColorSchemeProvider } from "@/contexts/ColorSchemeContext";
import "@/global.css";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { Platform } from "react-native";
import "react-native-reanimated";

const queryClient = new QueryClient();

export default function RootWrapper() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <ColorSchemeProvider>
        <QueryClientProvider client={queryClient}>
          <RootLayout />
        </QueryClientProvider>
      </ColorSchemeProvider>
    </ClerkProvider>
  );
}

function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const { isLoaded } = useAuth();

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  if (!isLoaded) {
    return <Spinner size="large" className="min-h-screen" />;
  }

  return (
    <ThemedView className="min-h-screen">
      {Platform.OS === "web" && <ThemedNavBar />}
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(web)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
      {/* <StatusBar style="auto" /> */}
    </ThemedView>
  );
}
