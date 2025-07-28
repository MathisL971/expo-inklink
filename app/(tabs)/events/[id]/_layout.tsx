import { Stack } from "expo-router";

export default function EventLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="tickets/index" options={{ headerShown: false }} />
        </Stack>
    )
}