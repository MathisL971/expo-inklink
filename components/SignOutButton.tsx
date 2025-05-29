import { useClerk } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { ThemedButton } from "./ThemedButton";

export const SignOutButton = () => {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.navigate("/");
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <ThemedButton
      title="Sign out"
      action="primary"
      size="sm"
      variant="solid"
      onPress={handleSignOut}
    />
  );
};
