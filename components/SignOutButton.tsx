import { useClerk } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Platform } from "react-native";
import { ThemedButton, ThemedButtonProps } from "./ThemedButton";

export const SignOutButton = (
  props: Omit<ThemedButtonProps, "onPress" | "title" | "action" | "variant">
) => {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(() => {
        if (Platform.OS === "web") {
          router.replace("/");
        }
      });
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <ThemedButton
      {...props}
      onPress={handleSignOut}
      title="Sign out"
      action="primary"
      variant="solid"
    />
  );
};
