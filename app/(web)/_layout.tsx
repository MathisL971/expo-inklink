import { isAdmin } from "@/utils/auth";
import { useUser } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";

export default function WebLayout() {
  const { user } = useUser();

  if (!user || !isAdmin(user)) {
    return <Redirect href={"/"} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="events" options={{ title: "Events" }} />
      <Stack.Screen name="users" options={{ title: "Users" }} />
    </Stack>
  );
}
