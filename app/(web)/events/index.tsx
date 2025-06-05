import Container from "@/components/Container";
import EventsTable from "@/components/EventsTable";
import { ThemedButton } from "@/components/ThemedButton";
import {
  AlertIcon,
  AlertText,
  Alert as CustomAlert,
} from "@/components/ui/alert";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { AlertCircleIcon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { getColor } from "@/constants/Colors";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { fetchEvents } from "@/services/event";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";

export default function EventsScreen() {
  const { mode } = useColorScheme();

  const { data, isLoading, error } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
    staleTime: 60 * 1000,
  });

  return (
    <Container className="gap-3">
      <HStack className="justify-end">
        <ThemedButton
          title="Create event"
          size="sm"
          onPress={() => router.push("/(web)/events/create")}
        />
      </HStack>

      {isLoading ? (
        <Spinner size={"large"} />
      ) : error ? (
        <CustomAlert action="error">
          <AlertIcon as={AlertCircleIcon} />
          <AlertText>Error: {error.message}</AlertText>
        </CustomAlert>
      ) : !data ? (
        <CustomAlert action="info">
          <AlertIcon as={AlertCircleIcon} />
          <AlertText>No data</AlertText>
        </CustomAlert>
      ) : (
        <Box
          className="rounded-lg overflow-hidden w-full border"
          style={{ borderColor: getColor("border", mode) }}
        >
          <EventsTable events={data.events} />
        </Box>
      )}
    </Container>
  );
}
