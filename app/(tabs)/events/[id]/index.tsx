import Container from "@/components/Container";
import { ExternalLink } from "@/components/ExternalLink";
import PaymentModal from "@/components/PaymentModal";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import TicketSelectionComponent from "@/components/TicketSelectionComponent";
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
import { createReservation, updateReservation } from "@/services/reservation";
import { createTickets } from "@/services/ticket";
import { Reservation, TicketSelection } from "@/types";
import { formatEventTimesForUser } from "@/utils/timezone";
import { useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ExternalPathString, router, useLocalSearchParams } from "expo-router";
import {
  Calendar,
  Car,
  Clock,
  ExternalLink as ExternalLinkIcon,
  MapPin,
  Tag,
  Ticket,
} from "lucide-react-native";
import React, { useState } from "react";
import { Image, Alert as RNAlert, ScrollView, TouchableOpacity, View } from "react-native";

export default function EventScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { mode: colorScheme } = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const { user } = useUser();

  // Modal state management
  const [reservation, setReservation] = useState<Reservation | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["event", id],
    queryFn: () => fetchEvent(id),
  });

  const createReservationMutation = useMutation({
    mutationFn: createReservation,
    onSuccess: (reservation) => {
      setReservation(reservation);
    },
    onError: (error) => {
      console.error('Error creating reservation:', error);
      RNAlert.alert('Error', 'Failed to reserve tickets. Please try again.');
    }
  })

  const createTicketsMutation = useMutation({
    mutationFn: createTickets,
    onError: (error) => {
      console.error('Error creating tickets:', error);
      RNAlert.alert('Error', 'Failed to create tickets. Please try again.');
    }
  })

  const updateReservationMutation = useMutation({
    mutationFn: updateReservation,
    onError: (error) => {
      console.error('Error updating reservation:', error);
      RNAlert.alert('Error', 'Failed to update reservation. Please try again.');
    }
  })

  // Use timezone-aware formatting for user's local time
  const getFormattedTimes = (event: any) => {
    if (!event) return null;
    return formatEventTimesForUser(
      event.startDate,
      event.endDate,
      event.timezone || "UTC"
    );
  };

  // Handle continue to payment - opens modal
  const handleContinueToPayment = (selectedTickets: TicketSelection[]) => {
    createReservationMutation.mutate({ eventId: id, userId: user!.id, tickets: selectedTickets });
  };

  // Handle free ticket purchase directly
  const handleFreePurchase = async (selectedTickets: TicketSelection[]) => {
    createTicketsMutation.mutate({ eventId: id, userId: user!.id, reservationId: reservation!.id, selectedTickets });
  };

  // Handle closing payment modal
  const handleClosePaymentModal = () => {
    setReservation(null);
    refetch();
  };

  // Handle purchase complete
  const handlePurchaseComplete = async () => {
    await Promise.all([
      updateReservationMutation.mutateAsync({ reservationId: reservation!.id, status: "paid" }),
      createTicketsMutation.mutateAsync({ eventId: id, userId: user!.id, reservationId: reservation!.id, selectedTickets: reservation!.tickets })
    ]);
    setReservation(null);
    refetch();
    router.push(`/events/${id}/tickets`);
  }

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
                  size="md"
                  variant="outline"
                  action="warning"
                  style={{
                    backgroundColor: colorScheme === "light" ? "rgba(245, 158, 11, 0.1)" : "rgba(251, 191, 36, 0.2)",
                    borderColor: colorScheme === "light" ? "rgba(245, 158, 11, 0.5)" : "rgba(251, 191, 36, 0.5)",
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                  }}
                >
                  <BadgeText style={{ fontSize: 13, fontWeight: "600" }}>{data.format}</BadgeText>
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
                    {data.startDate ? getFormattedTimes(data)?.formattedStartDate : "N/A"}
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
                      {data.startDate ? getFormattedTimes(data)?.formattedStartTime : "N/A"} - {data.startDate ? getFormattedTimes(data)?.formattedEndTime : "N/A"}
                    </ThemedText>
                  </View>
                  {data.startDate && getFormattedTimes(data) && (
                    <ThemedText
                      colorVariant="textTertiary"
                      className="text-xs mt-1"
                    >
                      Your timezone • Event timezone: {getFormattedTimes(data)?.eventTimezone}
                    </ThemedText>
                  )}
                  {data.startDate && data.endDate && !getFormattedTimes(data)?.isSameDay && (
                    <ThemedText
                      colorVariant="textSecondary"
                      className="text-sm mt-1"
                    >
                      Ends: {data.endDate ? getFormattedTimes(data)?.formattedEndDate : "N/A"}
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
                    size="md"
                    variant="outline"
                    action="info"
                    style={{
                      backgroundColor: colorScheme === "light" ? "rgba(14, 165, 233, 0.1)" : "rgba(56, 189, 248, 0.2)",
                      borderColor: colorScheme === "light" ? "rgba(14, 165, 233, 0.5)" : "rgba(56, 189, 248, 0.5)",
                      borderRadius: 12,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                    }}
                  >
                    <BadgeText style={{ fontSize: 13, fontWeight: "500" }}>{discipline}</BadgeText>
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
                    size="md"
                    variant="outline"
                    action="success"
                    style={{
                      backgroundColor: colorScheme === "light" ? "rgba(34, 197, 94, 0.1)" : "rgba(74, 222, 128, 0.2)",
                      borderColor: colorScheme === "light" ? "rgba(34, 197, 94, 0.5)" : "rgba(74, 222, 128, 0.5)",
                      borderRadius: 12,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                    }}
                  >
                    <BadgeText style={{ fontSize: 13, fontWeight: "500" }}>{language}</BadgeText>
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

            {/* Ticket Purchase Section */}
            {data.ticketTiers && data.ticketTiers.length > 0 && (
              <ThemedView className="p-2 mb-4">
                <HStack className="items-center mb-4">
                  <Icon as={Ticket} size="md" color={colors.primary} />
                  <ThemedText className="font-semibold text-lg ml-2">
                    Tickets Available
                  </ThemedText>
                </HStack>

                <TicketSelectionComponent
                  ticketTiers={data.ticketTiers}
                  onContinueToPayment={handleContinueToPayment}
                  onFreePurchase={handleFreePurchase}
                  isLoading={createReservationMutation.isPending}
                />
              </ThemedView>
            )}

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
                    Created: {data.createdAt ? new Date(data.createdAt).toLocaleDateString() : "N/A"}
                  </ThemedText>
                )}
                {data.updatedAt && (
                  <ThemedText colorVariant="textTertiary" className="text-xs">
                    Last updated: {data.updatedAt ? new Date(data.updatedAt).toLocaleDateString() : "N/A"}
                  </ThemedText>
                )}
              </View>
            )}
          </View>
          <PaymentModal
            onClose={handleClosePaymentModal}
            eventId={data.id}
            reservation={reservation}
            onPurchaseComplete={handlePurchaseComplete}
          />
        </ScrollView>
      )}
    </Container>
  );
}
