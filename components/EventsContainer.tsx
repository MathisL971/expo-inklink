import { useEvents } from "@/hooks/useEvents";
import { ScrollView } from "react-native";
import EventsList from "./EventsList";
import { Alert, AlertIcon, AlertText } from "./ui/alert";
import { AlertCircleIcon } from "./ui/icon";
import { Spinner } from "./ui/spinner";
import { VStack } from "./ui/vstack";

export default function EventsContainer() {
  const { data, isLoading, error } = useEvents();

  if (isLoading) {
    return (
      <VStack className="flex-1 justify-center items-center">
        <Spinner size={"large"} />
      </VStack>
    );
  }

  if (error) {
    return (
      <VStack className="flex-1 justify-center items-center">
        <Alert action="error" variant="solid">
          <AlertIcon as={AlertCircleIcon} />
          <AlertText>Error: {error.message}</AlertText>
        </Alert>
      </VStack>
    );
  }

  if (!data || data.count === 0) {
    return (
      <VStack className="flex-1 justify-center items-center">
        <Alert action="muted" variant="solid">
          <AlertIcon as={AlertCircleIcon} />
          <AlertText>
            There are no upcoming events posted yet... Check back again soon!
          </AlertText>
        </Alert>
      </VStack>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <EventsList events={data.events} />
    </ScrollView>
  );
}
