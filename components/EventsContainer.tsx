import { fetchEvents } from "@/services/event";
import { useQuery } from "@tanstack/react-query";
import EventsList from "./EventsList";
import { ThemedText } from "./ThemedText";
import { Alert, AlertIcon, AlertText } from "./ui/alert";
import { AlertCircleIcon } from "./ui/icon";
import { Spinner } from "./ui/spinner";
import { VStack } from "./ui/vstack";

export default function EventsContainer() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
    staleTime: 60 * 1000,
  });

  return (
    <VStack className="gap-4 flex-1 justify-center">
      {isLoading ? (
        <Spinner size="large" />
      ) : error ? (
        <Alert variant="solid" action="error">
          <AlertIcon as={AlertCircleIcon} />
          <AlertText>Error: {error.message}</AlertText>
        </Alert>
      ) : !data ? (
        <Alert variant="solid" action="info">
          <AlertIcon as={AlertCircleIcon} />
          <AlertText>No data</AlertText>
        </Alert>
      ) : data.count > 0 ? (
        <EventsList events={data.events} />
      ) : (
        <ThemedText
          colorVariant="textTertiary"
          size="sm"
          className="italic text-center self-center"
        >
          There are no upcoming events posted yet... Check back again soon!
        </ThemedText>
      )}
    </VStack>
  );
}
