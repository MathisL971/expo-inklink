import EventsContainer from "@/components/EventsContainer";
import { ThemedView } from "@/components/ThemedView";
import { ScrollView } from "react-native";

export default function HomeScreen() {
  return (
    <ThemedView className="flex-1 flex-col items-center justify-center">
      <ScrollView className="flex-1 flex-col pt-4 pb-12 px-2 sm:px-4 md:px-8 lg:px-12 xl:px-14 2xl:px-16">
        <EventsContainer />
      </ScrollView>
    </ThemedView>
  );
}
