import Container from "@/components/Container";
import { ExternalLink } from "@/components/ExternalLink";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Alert, AlertIcon } from "@/components/ui/alert";
import { Badge, BadgeText } from "@/components/ui/badge";
import { HStack } from "@/components/ui/hstack";
import { ArrowLeftIcon, Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Colors, getColor } from "@/constants/Colors";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { fetchEvent } from "@/services/event";
import { useQuery } from "@tanstack/react-query";
import { ExternalPathString, router, useLocalSearchParams } from "expo-router";
import {
  Calendar,
  Car,
  Clock,
  ExternalLink as ExternalLinkIcon,
  MapPin,
  Tag,
} from "lucide-react-native";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";

export default function EventScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { mode: colorScheme } = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const { data, isLoading, error } = useQuery({
    queryKey: ["event", id],
    queryFn: () => fetchEvent(id),
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Container>
      <TouchableOpacity
        className="mb-4 flex-row items-center gap-2"
        onPress={() => {
          router.back();
        }}
      >
        <Icon
          as={ArrowLeftIcon}
          size="md"
          color={getColor("tint", colorScheme)}
          className="mt-0.5 ml-0.5"
        />
        <ThemedText colorVariant="tint" className="text-md flex-row">
          Back
        </ThemedText>
      </TouchableOpacity>
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <Spinner size="large" />
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center px-4">
          <ThemedText colorVariant="error" className="text-center">
            Error: {error.message}
          </ThemedText>
        </View>
      ) : !data ? (
        <View className="flex-1 justify-center items-center">
          <ThemedText colorVariant="textTertiary">No event found</ThemedText>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          {data.image && (
            <View className="w-full h-64 mb-6">
              <Image
                source={{ uri: data.image }}
                className="w-full h-full"
                style={{ borderRadius: 12 }}
                resizeMode="cover"
              />
            </View>
          )}

          <View>
            <ThemedView className="mb-4">
              <HStack className="gap-2 mb-2" style={{ flexWrap: "wrap" }}>
                <Badge
                  key={data.format}
                  size="lg"
                  variant="outline"
                  className="px-2 py-1 rounded-md"
                  action="warning"
                >
                  <BadgeText>{data.format}</BadgeText>
                </Badge>
              </HStack>

              <ThemedText className="text-2xl font-bold leading-tight mb-2">
                {data.title}
              </ThemedText>
            </ThemedView>

            <ThemedView className="p-2 rounded-xl mb-2">
              <View className="flex-row items-start mb-3">
                <Calendar
                  size={20}
                  color={colors.primary}
                  style={{ marginTop: 2, marginRight: 12 }}
                />
                <View className="flex-1">
                  <ThemedText className="font-semibold mb-1">
                    {formatDate(data.startDate)}
                  </ThemedText>
                  <View className="flex-row items-center">
                    <Clock
                      size={16}
                      color={colors.textSecondary}
                      style={{ marginRight: 6 }}
                    />
                    <ThemedText
                      colorVariant="textSecondary"
                      className="text-sm"
                    >
                      {formatTime(data.startDate)} - {formatTime(data.endDate)}
                    </ThemedText>
                  </View>
                  {data.startDate.split("T")[0] !==
                    data.endDate.split("T")[0] && (
                      <ThemedText
                        colorVariant="textSecondary"
                        className="text-sm mt-1"
                      >
                        Ends: {formatDate(data.endDate)}
                      </ThemedText>
                    )}
                </View>
              </View>
            </ThemedView>

            {/* Location Information */}
            {(data.eventType === "In-Person" || data.eventType === "Hybrid") && data.address && (
              <ThemedView className="p-2 rounded-xl mb-2">
                <View className="flex-row items-start">
                  <MapPin
                    size={20}
                    color={colors.primary}
                    style={{ marginTop: 2, marginRight: 12 }}
                  />
                  <View className="flex-1">
                    <ThemedText className="font-semibold mb-1">
                      Location
                    </ThemedText>
                    {data.address.venue && (
                      <ThemedText colorVariant="textSecondary" className="mb-1">
                        {data.address.venue}
                      </ThemedText>
                    )}
                    <ThemedText colorVariant="textSecondary">
                      {data.address.street}
                    </ThemedText>
                    <ThemedText colorVariant="textSecondary">
                      {data.address.city}, {data.address.state} {data.address.zipCode}
                    </ThemedText>
                    <ThemedText colorVariant="textSecondary">
                      {data.address.country}
                    </ThemedText>
                  </View>
                </View>
              </ThemedView>
            )}

            {/* Parking Information */}
            {(data.eventType === "In-Person" || data.eventType === "Hybrid") && data.address?.parkingAvailable && data.address.parkingAvailable !== "No" && (
              <ThemedView className="p-2 rounded-xl mb-2">
                <View className="flex-row items-start">
                  <Car
                    size={20}
                    color={colors.primary}
                    style={{ marginTop: 2, marginRight: 12 }}
                  />
                  <View className="flex-1">
                    <ThemedText className="font-semibold mb-1">
                      Parking Information
                    </ThemedText>
                    <ThemedText colorVariant="textSecondary" className="mb-1">
                      Parking: {data.address.parkingAvailable}
                    </ThemedText>
                    {data.address.parkingCost && (
                      <ThemedText colorVariant="textSecondary" className="mb-1">
                        Cost: {data.address.parkingCost}
                      </ThemedText>
                    )}
                    {data.address.parkingDetails && (
                      <ThemedText colorVariant="textSecondary" className="mb-1">
                        {data.address.parkingDetails}
                      </ThemedText>
                    )}
                    {data.address.parkingInstructions && (
                      <ThemedText colorVariant="textSecondary">
                        Instructions: {data.address.parkingInstructions}
                      </ThemedText>
                    )}
                  </View>
                </View>
              </ThemedView>
            )}

            <ThemedView className="p-2 rounded-xl mb-2">
              <View className="flex-row items-start mb-3">
                <Tag
                  size={20}
                  color={colors.primary}
                  style={{ marginTop: 2, marginRight: 12 }}
                />
                <ThemedText className="font-semibold">Disciplines</ThemedText>
              </View>
              <HStack className="gap-2 mb-2" style={{ flexWrap: "wrap" }}>
                {data.disciplines.map((discipline) => (
                  <Badge
                    key={discipline}
                    size="lg"
                    variant="outline"
                    action="info"
                    className="px-2 py-1 rounded-md"
                  >
                    <BadgeText>{discipline}</BadgeText>
                  </Badge>
                ))}
              </HStack>
            </ThemedView>

            <ThemedView className="p-2 rounded-xl mb-2">
              <View className="flex-row items-start mb-3">
                <Tag
                  size={20}
                  color={colors.primary}
                  style={{ marginTop: 2, marginRight: 12 }}
                />
                <ThemedText className="font-semibold">Languages</ThemedText>
              </View>
              <HStack className="gap-2 mb-2" style={{ flexWrap: "wrap" }}>
                {data.languages.map((language) => (
                  <Badge
                    key={language}
                    size="lg"
                    variant="outline"
                    action="success"
                    className="px-2 py-1 rounded-md"
                  >
                    <BadgeText>{language}</BadgeText>
                  </Badge>
                ))}
              </HStack>
            </ThemedView>

            <ThemedView className="p-2 mb-4">
              <ThemedText className="font-semibold mb-3">
                About this Event
              </ThemedText>
              <ThemedText colorVariant="textSecondary">
                {data.description}
              </ThemedText>
            </ThemedView>

            {data.note && (
              <View
                className="p-4 rounded-xl mb-4"
                style={{
                  backgroundColor: colors.infoBg,
                  borderWidth: 1,
                  borderColor: colors.infoBorder,
                }}
              >
                <ThemedText
                  className="font-semibold mb-2"
                  style={{ color: colors.info }}
                >
                  Additional Information
                </ThemedText>
                <ThemedText style={{ color: colors.info }}>
                  {data.note}
                </ThemedText>
              </View>
            )}

            {data.source && (
              <ExternalLink href={data.source as ExternalPathString}>
                <Alert action="info" className="w-full">
                  <AlertIcon as={ExternalLinkIcon} size="lg" />
                  <VStack>
                    <Text className="font-semibold text-typography-900">
                      View Original Source
                    </Text>
                    <Text size="sm" className="text-typography-900">
                      {data.source}
                    </Text>
                  </VStack>
                </Alert>
              </ExternalLink>
            )}

            {(data.createdAt || data.updatedAt) && (
              <View
                className="mt-6 pt-4"
                style={{ borderTopWidth: 1, borderTopColor: colors.border }}
              >
                {data.createdAt && (
                  <ThemedText
                    colorVariant="textTertiary"
                    className="text-xs mb-1"
                  >
                    Created: {formatDate(data.createdAt)}
                  </ThemedText>
                )}
                {data.updatedAt && (
                  <ThemedText colorVariant="textTertiary" className="text-xs">
                    Last updated: {formatDate(data.updatedAt)}
                  </ThemedText>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </Container>
  );
}
