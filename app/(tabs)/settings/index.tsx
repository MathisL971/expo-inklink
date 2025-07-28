import Container from "@/components/Container";
import { SignOutButton } from "@/components/SignOutButton";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import { Redirect, useRouter } from "expo-router";
import { Platform, View } from "react-native";

export default function SettingsScreen() {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  if (!isSignedIn && Platform.OS === "web") {
    return <Redirect href={"/"} />;
  }

  return (
    <Container className="justify-center items-center">
      <SignedIn>
        {Platform.OS !== "web" ? (
          <SignOutButton size="xl" />
        ) : (
          <ThemedText>Settings Screen</ThemedText>
        )}
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
    </Container>
  );
}
