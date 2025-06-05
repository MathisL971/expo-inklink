import ColorSchemeToggleButton from "@/components/ColorSchemeToggleButton";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";
import { Platform } from "react-native";

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();
  const { mode } = useColorScheme();

  if (isSignedIn) {
    return <Redirect href={"/"} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: Platform.OS !== "web",
        headerRight: () => <ColorSchemeToggleButton />,
        headerStyle: {
          backgroundColor: Colors[mode ?? "light"].navbarBackground,
        },
        headerTitleStyle: {
          color: Colors[mode ?? "light"].text,
        },
      }}
    >
      <Stack.Screen
        name="sign-in"
        options={{
          title: "Sign In",
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          title: "Sign Up",
        }}
      />
    </Stack>
  );
}
