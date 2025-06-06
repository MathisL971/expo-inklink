import { getColor } from "@/constants/Colors";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { ExternalPathString } from "expo-router";
import type { Event } from "../types/index";
import { ExternalLink } from "./ExternalLink";
import ThemedHeading from "./ThemedHeading";
import { ThemedText } from "./ThemedText";
import { Card } from "./ui/card";
import { HStack } from "./ui/hstack";
import { ArrowRightIcon, Icon } from "./ui/icon";
import { Image } from "./ui/image";

export default function ThemedEventCard({ event }: { event: Event }) {
  const { mode } = useColorScheme();

  return (
    <Card
      className="p-5 rounded-md max-h-[600px] max-w-[300px] m-3"
      style={{
        backgroundColor: getColor("card", mode),
      }}
    >
      <Image
        source={{
          uri:
            event.image ||
            "https://expo-inklink-bucket.s3.us-east-2.amazonaws.com/event_placeholder.png",
        }}
        className="mb-5 h-[250px] w-[250px] rounded-md"
        alt="image"
      />

      {/* Date and location with truncation */}
      <ThemedText
        colorVariant="textSecondary"
        className="text-sm truncate"
        numberOfLines={1}
      >
        {new Date(event.startDate).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        })}
        {" | "}
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
          className="mt-2"
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
