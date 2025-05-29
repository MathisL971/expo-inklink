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
      className="p-5 rounded-md max-w-[360px] m-3"
      style={{
        backgroundColor: getColor("card", mode),
      }}
    >
      <Image
        source={{
          uri: event.image ? `${event.image}/id/1/200/200.jpg` : "",
        }}
        className="mb-6 h-[240px] w-full rounded-md aspect-[263/240]"
        alt="image"
      />
      <ThemedText className="text-sm">
        {event.date} | {event.location}
      </ThemedText>
      <ThemedHeading size="xl">{event.title}</ThemedHeading>
      <ThemedText className="mt-1">{event.description}</ThemedText>
      <ExternalLink href={event.link as ExternalPathString} className="mt-4">
        <HStack className="items-center">
          <ThemedText type="link" className="text-sm flex-row">
            Learn more
          </ThemedText>
          <ThemedText type="link">
            <Icon as={ArrowRightIcon} size="sm" className="mt-0.5 ml-0.5" />
          </ThemedText>
        </HStack>
      </ExternalLink>
    </Card>
  );
}
