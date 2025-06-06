import ThemedNavBar from "@/components/ThemedNavBar";
import { ThemedView } from "@/components/ThemedView";
import { Spinner } from "@/components/ui/spinner";
import {
  ColorSchemeProvider,
  useColorScheme,
} from "@/contexts/ColorSchemeContext";
import "@/global.css";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
  onlineManager,
} from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as Network from "expo-network";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { AppState, AppStateStatus, Platform } from "react-native";
import "react-native-reanimated";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

onlineManager.setEventListener((setOnline) => {
  const eventSubscription = Network.addNetworkStateListener((state) => {
    setOnline(!!state.isConnected);
  });
  return eventSubscription.remove;
});

export default function RootWrapper() {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);
    return () => subscription.remove();
  }, []);

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
  const { isLoaded: isAuthLoaded } = useAuth();
  const { isLoading: colorSchemeLoading } = useColorScheme();

  useEffect(() => {
    if (!colorSchemeLoading && isAuthLoaded && loaded) {
      SplashScreen.hideAsync();
    }
  }, [colorSchemeLoading, isAuthLoaded, loaded]);

  if (colorSchemeLoading || !isAuthLoaded || !loaded) {
    return (
      <ThemedView className="min-h-screen">
        <Spinner size="large" className="min-h-screen" />
      </ThemedView>
    );
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
