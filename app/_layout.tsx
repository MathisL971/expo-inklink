import ThemedNavBar from "@/components/ThemedNavBar";
import { ThemedView } from "@/components/ThemedView";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Spinner } from "@/components/ui/spinner";
import {
  ColorSchemeProvider,
  useColorScheme,
} from "@/contexts/ColorSchemeContext";
import "@/global.css";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import NetInfo from "@react-native-community/netinfo";
import {
  focusManager,
  onlineManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { AppState, AppStateStatus, Platform, StatusBar } from "react-native";
import "react-native-reanimated";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected);
  });
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
            <ThemeWrapper />
          </QueryClientProvider>
        </ColorSchemeProvider>
    </ClerkProvider>
  );
}

function ThemeWrapper() {
  const { mode } = useColorScheme();

  return (
    <GluestackUIProvider mode={mode}> 
      <RootLayout />
    </GluestackUIProvider>
  )
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
      <StatusBar barStyle={"dark-content"} />
    </ThemedView>
  );
}
