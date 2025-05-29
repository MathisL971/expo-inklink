import { SignOutButton } from "@/components/SignOutButton";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedView } from "@/components/ThemedView";
import { SignedIn, SignedOut } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { View } from "react-native";

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <ThemedView className="flex-1 flex-col items-center justify-center">
      <SignedIn>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <View className="flex-col gap-3">
          <ThemedButton
            title="Sign in"
            action="primary"
            size="xl"
            variant="solid"
            onPress={() => router.navigate("/(auth)/sign-in")}
          />
          <ThemedButton
            title="Sign up"
            action="primary"
            size="xl"
            variant="solid"
            onPress={() => router.navigate("/(auth)/sign-up")}
          />
        </View>
      </SignedOut>
    </ThemedView>
  );
}
