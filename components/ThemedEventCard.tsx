import { getColor } from "@/constants/Colors";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { formatEventTimesForUser } from "@/utils/timezone";
import { router } from "expo-router";
import { Platform, TouchableOpacity } from "react-native";
import type { Event } from "../types/index";
import ThemedHeading from "./ThemedHeading";
import { ThemedText } from "./ThemedText";
import { Badge, BadgeText } from "./ui/badge";
import { Card } from "./ui/card";
import { HStack } from "./ui/hstack";
import { ArrowRightIcon, Icon } from "./ui/icon";
import { Image } from "./ui/image";

export default function ThemedEventCard({ event }: { event: Event }) {
  const { mode } = useColorScheme();

  // Format times for user's timezone
  const formattedTimes = formatEventTimesForUser(
    event.startDate,
    event.endDate,
    event.timezone || "UTC"
  );

  return (
    <Card
      className={`p-6 rounded-xl flex-1`}
      style={{
        backgroundColor: getColor("card", mode),
        shadowColor: mode === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 0, 0, 0.3)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 1,
        borderColor: getColor("borderLight", mode),
      }}
    >
      {event.image && (<Image
        source={{
          uri:
            event.image ||
            "https://expo-inklink-bucket.s3.us-east-2.amazonaws.com/events/event_placeholder.png",
        }}
        className="mb-6 h-[200px] w-full rounded-lg"
        alt="Event image"
      />
      )}

      <HStack className="gap-2 mb-4" style={{ flexWrap: "wrap" }}>
        <Badge
          key={event.format}
          size="sm"
          variant="outline"
          action="warning"
          style={{
            backgroundColor: mode === "light" ? "rgba(245, 158, 11, 0.1)" : "rgba(251, 191, 36, 0.2)",
            borderColor: mode === "light" ? "rgba(245, 158, 11, 0.5)" : "rgba(251, 191, 36, 0.5)",
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 6,
          }}
        >
          <BadgeText style={{ fontSize: 12, fontWeight: "600" }}>{event.format}</BadgeText>
        </Badge>
        {event.disciplines.slice(0, 2).map((discipline) => (
          <Badge
            key={discipline}
            size="sm"
            variant="outline"
            action="info"
            style={{
              backgroundColor: mode === "light" ? "rgba(14, 165, 233, 0.1)" : "rgba(56, 189, 248, 0.2)",
              borderColor: mode === "light" ? "rgba(14, 165, 233, 0.5)" : "rgba(56, 189, 248, 0.5)",
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
          >
            <BadgeText style={{ fontSize: 12, fontWeight: "500" }}>{discipline}</BadgeText>
          </Badge>
        ))}
        {event.disciplines.length > 2 && (
          <Badge
            size="sm"
            variant="outline"
            action="info"
            style={{
              backgroundColor: getColor("backgroundElevated", mode),
              borderColor: getColor("border", mode),
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
          >
            <BadgeText style={{ fontSize: 12, fontWeight: "500" }}>+{event.disciplines.length - 2} more</BadgeText>
          </Badge>
        )}
        {event.languages.slice(0, 2).map((language) => (
          <Badge
            key={language}
            size="sm"
            variant="outline"
            action="success"
            style={{
              backgroundColor: mode === "light" ? "rgba(34, 197, 94, 0.1)" : "rgba(74, 222, 128, 0.2)",
              borderColor: mode === "light" ? "rgba(34, 197, 94, 0.5)" : "rgba(74, 222, 128, 0.5)",
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
          >
            <BadgeText style={{ fontSize: 12, fontWeight: "500" }}>{language}</BadgeText>
          </Badge>
        ))}
        {event.languages.length > 2 && (
          <Badge
            size="sm"
            variant="outline"
            action="success"
            style={{
              backgroundColor: getColor("backgroundElevated", mode),
              borderColor: getColor("border", mode),
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
          >
            <BadgeText style={{ fontSize: 12, fontWeight: "500" }}>+{event.languages.length - 2} more</BadgeText>
          </Badge>
        )}
      </HStack>

      <ThemedText
        colorVariant="textSecondary"
        className="text-sm line-clamp-1 mb-1"
        style={{ fontWeight: "500" }}
        {...(Platform.OS !== "web" ? { numberOfLines: 1 } : {})}
      >
        {formattedTimes.formattedDateRange}
      </ThemedText>

      <ThemedText
        colorVariant="textTertiary"
        className="text-xs line-clamp-1 mb-1"
        style={{ fontWeight: "400" }}
        {...(Platform.OS !== "web" ? { numberOfLines: 1 } : {})}
      >
        Your timezone • Event timezone: {formattedTimes.eventTimezone}
      </ThemedText>

      <ThemedText
        colorVariant="textSecondary"
        className="text-sm line-clamp-1 mb-3"
        style={{ fontWeight: "500" }}
        {...(Platform.OS !== "web" ? { numberOfLines: 1 } : {})}
      >
        {event.eventType === "Online" ? (
          "Online Event"
        ) : event.address ? (
          event.address.venue
            ? `${event.address.venue}, ${event.address.city}, ${event.address.state}`
            : `${event.address.city}, ${event.address.state}`
        ) : (
          "Location TBD"
        )}
      </ThemedText>

      {/* Parking Information */}
      {(event.eventType === "In-Person" || event.eventType === "Hybrid") &&
        event.address?.parkingAvailable &&
        event.address.parkingAvailable !== "No" && (
          <ThemedText
            colorVariant="textTertiary"
            className="text-xs mb-2"
            style={{ fontWeight: "500" }}
            {...(Platform.OS !== "web" ? { numberOfLines: 1 } : {})}
          >
            🚗 Parking: {event.address.parkingAvailable}
          </ThemedText>
        )}

      <ThemedHeading
        className="mt-1 line-clamp-2 mb-3"
        size="xl"
        style={{
          fontWeight: "700",
          lineHeight: 28,
          color: getColor("text", mode)
        }}
        {...(Platform.OS !== "web" ? { numberOfLines: 2 } : {})}
      >
        {event.title}
      </ThemedHeading>

      <ThemedText
        colorVariant="textSecondary"
        className="mt-2 flex-1 line-clamp-4 mb-4"
        style={{
          lineHeight: 20,
          fontSize: 14
        }}
        {...(Platform.OS !== "web" ? { numberOfLines: 4 } : {})}
      >
        {event.description}
      </ThemedText>

      <TouchableOpacity
        className="mt-auto flex-row items-center justify-center gap-2 px-4 py-3 rounded-xl"
        style={{
          backgroundColor: getColor("primary", mode),
          shadowColor: getColor("primary", mode),
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 4,
        }}
        onPress={() => {
          router.push({
            pathname: "/events/[id]",
            params: { id: event.id },
          });
        }}
      >
        <ThemedText
          style={{
            color: "white",
            fontWeight: "600",
            fontSize: 15
          }}
        >
          Learn More
        </ThemedText>
        <Icon
          as={ArrowRightIcon}
          size="sm"
          color="white"
        />
      </TouchableOpacity>
    </Card>
  );
}

