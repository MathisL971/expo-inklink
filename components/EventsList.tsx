import { Event } from "../types/index";
import ThemedEventCard from "./ThemedEventCard";
import { HStack } from "./ui/hstack";

export default function EventsList({ events }: { events: Event[] }) {
  return (
    <HStack className="flex-row flex-wrap items-center justify-evenly h-full flex-1">
      {events.map((event) => {
        return <ThemedEventCard key={event.id.toString()} event={event} />;
      })}
    </HStack>
  );
}
