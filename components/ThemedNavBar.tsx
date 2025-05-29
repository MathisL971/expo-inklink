import { getColor } from "@/constants/Colors";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { View } from "react-native";
import ColorSchemeToggleButton from "./ColorSchemeToggleButton";
import { SignOutButton } from "./SignOutButton";
import { ThemedButton } from "./ThemedButton";
import { ThemedText } from "./ThemedText";

export default function ThemedNavBar() {
  const { mode: theme } = useColorScheme();
  const router = useRouter();
  const { isSignedIn } = useAuth();

  return (
    <View
      className="flex-row items-center justify-between py-4 px-12"
      style={{
        backgroundColor: getColor("navbarBackground", theme),
      }}
    >
      <ThemedText type="title" onPress={() => router.navigate("/")}>
        Inklink
      </ThemedText>
      <View className="flex-row gap-5">
        <ColorSchemeToggleButton />
        {isSignedIn ? (
          <SignOutButton />
        ) : (
          <>
            <ThemedButton
              title="Sign in"
              action="primary"
              size="sm"
              variant="solid"
              onPress={() => router.navigate("/(auth)/sign-in")}
            />
            <ThemedButton
              title="Sign up"
              action="primary"
              size="sm"
              variant="solid"
              onPress={() => router.navigate("/(auth)/sign-up")}
            />
          </>
        )}
      </View>
    </View>
  );
}
