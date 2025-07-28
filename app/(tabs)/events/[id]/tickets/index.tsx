import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useLocalSearchParams } from "expo-router";

export default function TicketsScreen() {

    const { id } = useLocalSearchParams<{ id: string }>();

    return (
        <ThemedView className="flex-1">
            <ThemedText>Tickets for event {id}</ThemedText>
        </ThemedView>
    )
}