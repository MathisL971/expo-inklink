import { EventFilters } from "@/components/EventFilters";
import EventsContainer from "@/components/EventsContainer";
import { ThemedView } from "@/components/ThemedView";
import { VStack } from "@/components/ui/vstack";
import { getColor } from "@/constants/Colors";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { Platform } from "react-native";

export default function HomeScreen() {
  const { mode } = useColorScheme();

  return (
    <ThemedView 
        className="flex-1 flex-row"
    >
      {Platform.OS === "web" && (
        <VStack
          className="hidden lg:flex"
          style={{
            backgroundColor: getColor("card", mode),
            width: "25%",
          }}
        >
          <EventFilters />
        </VStack>
      )}
      <VStack
        className="flex-1"
        style={{
          width: Platform.OS === "web" && window.innerWidth > 1024 ? "75%" : "100%",
        }}
      >
        <EventsContainer />
      </VStack>
    </ThemedView>
  );
}