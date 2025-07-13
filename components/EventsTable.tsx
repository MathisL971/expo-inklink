import { getColor } from "@/constants/Colors";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { createEvent, deleteEvent } from "@/services/event";
import { deleteImage } from "@/services/image";
import type { Event } from "@/types";
import { getImageKey } from "@/utils/image";
import { formatDateInTimezone } from "@/utils/timezone";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExternalPathString } from "expo-router";
import { Pressable } from "react-native";
import { ExternalLink } from "./ExternalLink";
import { ThemedText } from "./ThemedText";
import { HStack } from "./ui/hstack";
import {
  CopyIcon,
  EditIcon,
  ExternalLinkIcon,
  Icon,
  TrashIcon,
} from "./ui/icon";
import {
  Table,
  TableBody,
  TableCaption,
  TableData,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export default function EventsTable({ events }: { events: Event[] }) {
  const { mode } = useColorScheme();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
  });

  const handleDelete = async (event: Event) => {
    if (confirm("Are you sure you want to delete this event?")) {
      if (event.image) await deleteImage(getImageKey(event.image));
      deleteMutation.mutate(event.id);
    }
  };

  const createMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
  });

  const handleDuplicate = (event: Event) => {
    if (confirm("Are you sure you want to duplicate this event?")) {
      createMutation.mutate({
        title: event.title + " (Copy)",
        description: event.description,
        note: event.note,
        image: event.image,
        startDate: event.startDate,
        endDate: event.endDate,
        timezone: event.timezone,
        eventType: event.eventType,
        address: event.address,
        videoConference: event.videoConference,
        source: event.source,
        format: event.format,
        disciplines: event.disciplines,
        access: event.access,
        ticketTiers: event.ticketTiers,
        organizerId: event.organizerId,
      });
    }
  };

  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow
          style={{
            borderColor: getColor("border", mode),
            backgroundColor: getColor("backgroundElevated", mode),
          }}
        >
          <TableHead>
            <ThemedText>Title</ThemedText>
          </TableHead>
          <TableHead className="hidden xl:block">
            <ThemedText>Description</ThemedText>
          </TableHead>
          <TableHead>
            <ThemedText>Date</ThemedText>
          </TableHead>
          <TableHead>
            <ThemedText>Location</ThemedText>
          </TableHead>
          <TableHead>
            <ThemedText>Actions</ThemedText>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
          <TableRow
            key={event.id}
            style={{ backgroundColor: getColor("background", mode), borderColor: getColor("border", mode) }}
          >
            <TableData>
              <ThemedText>{event.title}</ThemedText>
            </TableData>
            <TableData className="hidden xl:block">
              <ThemedText>
                {event.description.length < 60
                  ? event.description
                  : event.description.slice(0, 60) + "..."}
              </ThemedText>
            </TableData>
            <TableData>
              <ThemedText>
                {formatDateInTimezone(event.startDate, event.timezone || "UTC", { includeTime: false })}
              </ThemedText>
            </TableData>
            <TableData>
              <ThemedText>
                {event.eventType === "Online" ? (
                  <ThemedText>Online Event</ThemedText>
                ) : event.address ? (
                  (() => {
                    const addressText = event.address.venue
                      ? `${event.address.venue}, ${event.address.city}, ${event.address.state}`
                      : `${event.address.city}, ${event.address.state}`;
                    return addressText;
                  })()
                ) : (
                  <ThemedText>Location TBD</ThemedText>
                )}
              </ThemedText>
            </TableData>
            <TableData>
              <HStack className="gap-2">
                {event.source && (
                  <ExternalLink href={event.source as ExternalPathString}>
                    <Icon
                      as={ExternalLinkIcon}
                      color={getColor("icon", mode)}
                    />
                  </ExternalLink>
                )}
                <Pressable onPress={() => { }}>
                  <Icon as={EditIcon} color={getColor("warning", mode)} />
                </Pressable>
                <Pressable onPress={() => handleDuplicate(event)}>
                  <Icon as={CopyIcon} color={getColor("info", mode)} />
                </Pressable>
                <Pressable onPress={() => handleDelete(event)}>
                  <Icon as={TrashIcon} color={getColor("error", mode)} />
                </Pressable>
              </HStack>
            </TableData>
          </TableRow>
        ))}
      </TableBody>
      <TableCaption
        style={{
          borderColor: getColor("border", mode),
          backgroundColor: getColor("backgroundElevated", mode),
        }}
      >
        <ThemedText>
          {events.length} {events.length === 1 ? "event" : "events"}
        </ThemedText>
      </TableCaption>
    </Table>
  );
}
