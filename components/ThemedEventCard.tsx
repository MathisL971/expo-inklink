import { getColor } from "@/constants/Colors";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { ExternalPathString, router } from "expo-router";
import type { Event } from "../types/index";
import { ExternalLink } from "./ExternalLink";
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
      className={`p-5 rounded-md max-h-[600px] max-w-[300px] m-3 cursor-pointer`}
      style={{ backgroundColor: getColor("card", mode) }}
      onPointerDown={() => router.push({
        pathname: "/events/[id]",
        params: { id: event.id },
      })}
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

      {/* Disciplines as badges */}
      <HStack className="gap-2 mb-2" style={{ flexWrap: "wrap" }} >
         <Badge key={event.access} size="sm" variant="solid" className="p-0">
            <BadgeText className="px-1.5 py-0.5 rounded-sm" style={{ color: getColor("accentText", mode), backgroundColor: getColor("tint", mode) }}>{event.access}</BadgeText>
        </Badge>
        <Badge key={event.format} size="sm" variant="solid" action="success" className="p-0">
          <BadgeText className="px-1.5 py-0.5 rounded-sm" style={{ color: getColor("accentText", mode), backgroundColor: getColor("accent", mode) }}>{event.format}</BadgeText>
        </Badge>
        {event.disciplines.map((discipline) => (
          <Badge key={discipline} size="sm" variant="solid" action="success" className="p-0">
            <BadgeText className="px-1.5 py-0.5 rounded-sm" style={{ color: getColor("info", mode), backgroundColor: getColor("infoBg", mode) }}>{discipline}</BadgeText>
          </Badge>
        ))}
      </HStack>

      {/* Date and location with truncation */}
      <ThemedText
        colorVariant="textSecondary"
        className="text-sm line-clamp-1"
        numberOfLines={1}
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
        numberOfLines={1}
      >
        {event.location}
      </ThemedText>

      {/* Title with truncation (2 lines max) */}
      <ThemedHeading className="mt-1 line-clamp-2" size="xl" numberOfLines={2}>
        {event.title}
      </ThemedHeading>

      {/* Description with better truncation (3 lines max) */}
      <ThemedText
        colorVariant="textSecondary"
        className="mt-2 flex-1 line-clamp-4"
        numberOfLines={4}
      >
        {event.description}
      </ThemedText>

      {event.source && (
        <ExternalLink
          href={event.source as ExternalPathString}
          className="mt-4"
        >
          <HStack className="items-center">
            <ThemedText colorVariant="tint" className="text-sm flex-row">
              Learn more
            </ThemedText>
            <Icon
              as={ArrowRightIcon}
              size="sm"
              color={getColor("tint", mode)}
              className="mt-0.5 ml-0.5"
            />
          </HStack>
        </ExternalLink>
      )}
    </Card>
  );
}
