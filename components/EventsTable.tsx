import { getColor } from "@/constants/Colors";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { createEvent, deleteEvent } from "@/services/event";
import { deleteImage } from "@/services/image";
import type { Event } from "@/types";
import { getImageKey } from "@/utils/image";
import { formatDateInTimezone } from "@/utils/timezone";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExternalPathString } from "expo-router";
import { Dimensions, Pressable, View } from "react-native";
import { ExternalLink } from "./ExternalLink";
import { ThemedText } from "./ThemedText";
import { Badge, BadgeText } from "./ui/badge";
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
  const screenWidth = Dimensions.get('window').width;
  const showDescription = screenWidth > 1200; // Show description on larger screens

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
        languages: event.languages,
        access: event.access,
        ticketTiers: event.ticketTiers,
        featuredGuests: event.featuredGuests,
        organizerId: event.organizerId,
      });
    }
  };

  return (
    <View
      style={{
        backgroundColor: getColor("card", mode),
        borderRadius: 12,
        shadowColor: mode === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 0, 0, 0.3)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 1,
        borderColor: getColor("borderLight", mode),
        overflow: "hidden",
      }}
    >
      <Table className="w-full">
        <TableHeader>
          <TableRow
            style={{
              borderColor: getColor("borderLight", mode),
              backgroundColor: getColor("backgroundElevated", mode),
            }}
          >
            <TableHead style={{ padding: 16, width: showDescription ? "25%" : "35%" }}>
              <ThemedText style={{ fontWeight: "600", fontSize: 14 }}>Title</ThemedText>
            </TableHead>
            {showDescription && (
              <TableHead style={{ padding: 16, width: "30%" }}>
                <ThemedText style={{ fontWeight: "600", fontSize: 14 }}>Description</ThemedText>
              </TableHead>
            )}
            <TableHead style={{ padding: 16, width: showDescription ? "20%" : "25%" }}>
              <ThemedText style={{ fontWeight: "600", fontSize: 14 }}>Date & Time</ThemedText>
            </TableHead>
            <TableHead style={{ padding: 16, width: showDescription ? "20%" : "25%" }}>
              <ThemedText style={{ fontWeight: "600", fontSize: 14 }}>Location</ThemedText>
            </TableHead>
            <TableHead style={{ padding: 16, width: "15%" }}>
              <ThemedText style={{ fontWeight: "600", fontSize: 14 }}>Actions</ThemedText>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow
              key={event.id}
              style={{
                backgroundColor: getColor("background", mode),
                borderColor: getColor("borderLight", mode),
                borderBottomWidth: 1,
              }}
            >
              <TableData style={{ padding: 16, width: showDescription ? "25%" : "35%" }}>
                <ThemedText style={{ fontWeight: "600", fontSize: 14 }} numberOfLines={2}>
                  {event.title}
                </ThemedText>
                <HStack className="gap-2 mt-3" style={{ flexWrap: "wrap" }}>
                  <Badge
                    size="sm"
                    variant="outline"
                    action="warning"
                    style={{
                      backgroundColor: mode === "light" ? "rgba(245, 158, 11, 0.1)" : "rgba(251, 191, 36, 0.2)",
                      borderColor: mode === "light" ? "rgba(245, 158, 11, 0.5)" : "rgba(251, 191, 36, 0.5)",
                      borderRadius: 12,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                    }}
                  >
                    <BadgeText style={{ fontSize: 11, fontWeight: "600" }}>{event.format}</BadgeText>
                  </Badge>
                  {event.disciplines.slice(0, 1).map((discipline) => (
                    <Badge
                      key={discipline}
                      size="sm"
                      variant="outline"
                      action="info"
                      style={{
                        backgroundColor: mode === "light" ? "rgba(14, 165, 233, 0.1)" : "rgba(56, 189, 248, 0.2)",
                        borderColor: mode === "light" ? "rgba(14, 165, 233, 0.5)" : "rgba(56, 189, 248, 0.5)",
                        borderRadius: 12,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                      }}
                    >
                      <BadgeText style={{ fontSize: 11, fontWeight: "500" }}>{discipline}</BadgeText>
                    </Badge>
                  ))}
                  {event.disciplines.length > 1 && (
                    <Badge
                      size="sm"
                      variant="outline"
                      action="info"
                      style={{
                        backgroundColor: getColor("backgroundElevated", mode),
                        borderColor: getColor("border", mode),
                        borderRadius: 12,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                      }}
                    >
                      <BadgeText style={{ fontSize: 11, fontWeight: "500" }}>+{event.disciplines.length - 1}</BadgeText>
                    </Badge>
                  )}
                </HStack>
              </TableData>
              {showDescription && (
                <TableData style={{ padding: 16, width: "30%" }}>
                  <ThemedText
                    colorVariant="textSecondary"
                    style={{ fontSize: 13, lineHeight: 18 }}
                    numberOfLines={3}
                  >
                    {event.description.length < 100
                      ? event.description
                      : event.description.slice(0, 100) + "..."}
                  </ThemedText>
                </TableData>
              )}
              <TableData style={{ padding: 16, width: showDescription ? "20%" : "25%" }}>
                <View style={{ gap: 4 }}>
                  <ThemedText style={{ fontWeight: "600", fontSize: 13 }}>
                    {formatDateInTimezone(event.startDate, event.timezone || "UTC", {
                      includeTime: false,
                      dateStyle: "medium"
                    })}
                  </ThemedText>
                  <ThemedText style={{ fontWeight: "500", fontSize: 12 }}>
                    {(() => {
                      const date = new Date(event.startDate);
                      return date.toLocaleTimeString("en-US", {
                        timeZone: event.timezone || "UTC",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true
                      });
                    })()}
                  </ThemedText>
                  <ThemedText
                    colorVariant="textTertiary"
                    style={{ fontSize: 11 }}
                  >
                    {event.timezone || "UTC"}
                  </ThemedText>
                </View>
              </TableData>
              <TableData style={{ padding: 16, width: showDescription ? "20%" : "25%" }}>
                <ThemedText style={{ fontSize: 13 }} numberOfLines={2}>
                  {event.eventType === "Online" ? (
                    <ThemedText style={{ fontWeight: "500", color: getColor("primary", mode) }}>Online Event</ThemedText>
                  ) : event.address ? (
                    (() => {
                      const addressText = event.address.venue
                        ? `${event.address.venue}, ${event.address.city}`
                        : `${event.address.city}, ${event.address.state}`;
                      return addressText;
                    })()
                  ) : (
                    <ThemedText colorVariant="textTertiary">Location TBD</ThemedText>
                  )}
                </ThemedText>
              </TableData>
              <TableData style={{ padding: 16, width: "15%" }}>
                <HStack className="gap-2">
                  {event.source && (
                    <ExternalLink href={event.source as ExternalPathString}>
                      <Pressable
                        style={{
                          padding: 6,
                          borderRadius: 8,
                          backgroundColor: getColor("backgroundElevated", mode),
                          borderWidth: 1,
                          borderColor: getColor("borderLight", mode),
                        }}
                      >
                        <Icon
                          as={ExternalLinkIcon}
                          size="sm"
                          color={getColor("icon", mode)}
                        />
                      </Pressable>
                    </ExternalLink>
                  )}
                  <Pressable
                    onPress={() => { }}
                    style={{
                      padding: 6,
                      borderRadius: 8,
                      backgroundColor: getColor("backgroundElevated", mode),
                      borderWidth: 1,
                      borderColor: getColor("borderLight", mode),
                    }}
                  >
                    <Icon as={EditIcon} size="sm" color={getColor("warning", mode)} />
                  </Pressable>
                  <Pressable
                    onPress={() => handleDuplicate(event)}
                    style={{
                      padding: 6,
                      borderRadius: 8,
                      backgroundColor: getColor("backgroundElevated", mode),
                      borderWidth: 1,
                      borderColor: getColor("borderLight", mode),
                    }}
                  >
                    <Icon as={CopyIcon} size="sm" color={getColor("info", mode)} />
                  </Pressable>
                  <Pressable
                    onPress={() => handleDelete(event)}
                    style={{
                      padding: 6,
                      borderRadius: 8,
                      backgroundColor: getColor("backgroundElevated", mode),
                      borderWidth: 1,
                      borderColor: getColor("borderLight", mode),
                    }}
                  >
                    <Icon as={TrashIcon} size="sm" color={getColor("error", mode)} />
                  </Pressable>
                </HStack>
              </TableData>
            </TableRow>
          ))}
        </TableBody>
        <TableCaption
          style={{
            borderColor: getColor("borderLight", mode),
            backgroundColor: getColor("backgroundElevated", mode),
            padding: 16,
          }}
        >
          <ThemedText style={{ fontWeight: "500", fontSize: 14 }}>
            {events.length} {events.length === 1 ? "event" : "events"}
          </ThemedText>
        </TableCaption>
      </Table>
    </View>
  );
}
