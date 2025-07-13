import { getColor } from "@/constants/Colors";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
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

  return (
    <Card
      className={`p-5 rounded-md max-h-[600px] flex-1`}
      style={{ backgroundColor: getColor("card", mode) }}
    >
      <Image
        source={{
          uri:
            event.image ||
            "https://expo-inklink-bucket.s3.us-east-2.amazonaws.com/events/event_placeholder.png",
        }}
        className="mb-5 h-[250px] w-full rounded-md"
        alt="image"
      />

      <HStack className="gap-2 mb-2" style={{ flexWrap: "wrap" }}>
        <Badge
          key={event.format}
          size="sm"
          variant="outline"
          action="warning"
          className="px-1.5 py-0.5 rounded-sm"
        >
          <BadgeText>{event.format}</BadgeText>
        </Badge>
        {event.disciplines.map((discipline) => (
          <Badge
            key={discipline}
            size="sm"
            variant="outline"
            action="info"
            className="px-1.5 py-0.5 rounded-sm"
          >
            <BadgeText>{discipline}</BadgeText>
          </Badge>
        ))}
      </HStack>

      <ThemedText
        colorVariant="textSecondary"
        className="text-sm line-clamp-1"
        {...(Platform.OS !== "web" ? { numberOfLines: 1 } : {})}
      >
        {new Date(event.startDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
        {" - "}
        {new Date(event.startDate).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
        })}
        {" to "}
        {new Date(event.endDate).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
        })}
      </ThemedText>

      <ThemedText
        colorVariant="textSecondary"
        className="text-sm line-clamp-1"
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
            colorVariant="textSecondary"
            className="text-xs"
            {...(Platform.OS !== "web" ? { numberOfLines: 1 } : {})}
          >
            🚗 Parking: {event.address.parkingAvailable}
          </ThemedText>
        )}

      <ThemedHeading
        className="mt-1 line-clamp-2"
        size="xl"
        {...(Platform.OS !== "web" ? { numberOfLines: 2 } : {})}
      >
        {event.title}
      </ThemedHeading>

      <ThemedText
        colorVariant="textSecondary"
        className="mt-2 flex-1 line-clamp-4"
        {...(Platform.OS !== "web" ? { numberOfLines: 4 } : {})}
      >
        {event.description}
      </ThemedText>

      <TouchableOpacity
        className="mt-3 flex-row items-center gap-1"
        onPress={() => {
          router.push({
            pathname: "/events/[id]",
            params: { id: event.id },
          });
        }}
      >
        <ThemedText colorVariant="tint" className="text-sm flex-row">
          Learn more
        </ThemedText>
        <Icon
          as={ArrowRightIcon}
          size="sm"
          color={getColor("tint", mode)}
          className="mt-0.5 ml-0.5"
        />
      </TouchableOpacity>
    </Card>
  );
}

