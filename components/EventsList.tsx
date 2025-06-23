import { DimensionValue, View, useWindowDimensions } from "react-native";
import { Event } from "../types/index";
import ThemedEventCard from "./ThemedEventCard";

export default function EventsList({ events }: { events: Event[] }) {
  const { width } = useWindowDimensions();
  
  // Define breakpoints
  const getColumns = () => {
    if (width < 768) return 1; // Mobile
    if (width < 1224) return 2; // Tablet
    return 3; // Desktop
  };
  
  const columns = getColumns();
  const cardWidth = `${100 / columns - (columns > 1 ? 2 : 0)}%` as DimensionValue; // Subtract for gap spacing
  
  return (
    <View className="flex-row flex-wrap justify-evenly h-full flex-1 gap-4 mt-3 lg:mt-0">
      {events.map((event) => {
        return (
          <View 
            key={event.id.toString()}
            style={{ width: cardWidth }}
          >
            <ThemedEventCard event={event} />
          </View>
        );
      })}
    </View>
  );
}