import { fetchEvents } from "@/services/event";
import { useQuery } from "@tanstack/react-query";
import EventsList from "./EventsList";
import { ThemedText } from "./ThemedText";
import { Heading } from "./ui/heading";

export default function EventsContainer() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });

  if (isLoading) return <ThemedText>Loading...</ThemedText>;
  if (error) return <ThemedText>Error: {error.message}</ThemedText>;
  if (!data) return <ThemedText>No data</ThemedText>;

  const { events } = data;

  return (
    <>
      <Heading size="xl" className="mx-auto">
        Upcoming Events
      </Heading>
      <EventsList events={events} />
    </>
  );
}
