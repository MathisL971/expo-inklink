import { Colors, getColor } from "@/constants/Colors";
import {
  ACCESSIBILITY_FEATURES,
  COMMON_TIMEZONES,
  EVENT_ACCESS_LEVELS,
  EVENT_DISCIPLINES,
  EVENT_FORMATS,
  EVENT_LANGUAGES,
  EVENT_TYPES,
  VIDEO_CONFERENCE_PLATFORMS
} from "@/constants/Event";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { createEvent } from "@/services/event";
import { deleteImage } from "@/services/image";
import type { Event } from "@/types";
import { getImageKey } from "@/utils/image";
import { getUserTimezone } from "@/utils/timezone";
import { useUser } from "@clerk/clerk-expo";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ImagePickerAsset } from "expo-image-picker";
import { router } from "expo-router";
import { Building, Car, FileText, MapPin, Monitor, Plus, Shield, Ticket, Trash2, Users } from "lucide-react";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Platform, View } from "react-native";
import CustomImageUploader from "./CustomImageUploader";
import CustomInput from "./CustomInput";
import CustomMultiSelect from "./CustomMultiSelect";
import CustomPicker from "./CustomPicker";
import CustomWebDatePicker from "./CustomWebDatePicker";
import { FeaturedGuestsManager } from "./FeaturedGuestsManager";
import { ThemedButton } from "./ThemedButton";
import { ThemedText } from "./ThemedText";
import { Button, ButtonIcon, ButtonText } from "./ui/button";

type EventFormProps = {
  initialEvent?: Event;
};

// Event constants are now imported from @/constants/Event

export const EventForm = ({ initialEvent }: EventFormProps) => {
  const { user } = useUser();

  const { mode } = useColorScheme();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    watch,
    setValue,
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      title: initialEvent?.title || "",
      description: initialEvent?.description || "",
      note: initialEvent?.note || "",
      image: initialEvent?.image || "",
      startDate: initialEvent?.startDate || "",
      endDate: initialEvent?.endDate || "",
      timezone: initialEvent?.timezone || getUserTimezone(COMMON_TIMEZONES.map(tz => tz.value)),
      eventType: initialEvent?.eventType || "In-Person",
      address: {
        street: initialEvent?.address?.street || "",
        city: initialEvent?.address?.city || "",
        state: initialEvent?.address?.state || "",
        zipCode: initialEvent?.address?.zipCode || "",
        country: initialEvent?.address?.country || "",
        venue: initialEvent?.address?.venue || "",
        parkingAvailable: initialEvent?.address?.parkingAvailable || "No",
        parkingDetails: initialEvent?.address?.parkingDetails || "",
        parkingInstructions: initialEvent?.address?.parkingInstructions || "",
        parkingCost: initialEvent?.address?.parkingCost || "",
      },
      videoConference: {
        platform: initialEvent?.videoConference?.platform || "Zoom",
        link: initialEvent?.videoConference?.link || "",
        meetingId: initialEvent?.videoConference?.meetingId || "",
        passcode: initialEvent?.videoConference?.passcode || "",
        instructions: initialEvent?.videoConference?.instructions || "",
      },
      source: initialEvent?.source || "",
      format: initialEvent?.format || "",
      disciplines: initialEvent?.disciplines || [],
      languages: initialEvent?.languages || [],
      access: initialEvent?.access || "",
      organizerId: initialEvent?.organizerId || user?.id,
      ticketTiers: initialEvent?.ticketTiers || [],
      featuredGuests: initialEvent?.featuredGuests || [],
      accessibilityFeatures: initialEvent?.accessibilityFeatures || [],
    },
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      reset();
      router.push("/(web)/events");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // Helper to check if image is a local asset (from expo-image-picker)
  const isLocalImage = (img: any) => img && typeof img === "object" && img.uri;

  const onSubmit = async (eventData: any) => {
    let imageUrl = eventData.image;
    if (isLocalImage(eventData.image)) {
      // Only upload if it's a local asset
      imageUrl = await uploadImage(eventData.image);
    }

    // Process ticket tiers and set available = quantity for each tier
    const ticketTiers = (eventData.ticketTiers || []).map((tier: any) => ({
      ...tier,
      available: tier.quantity || 0 // Set available to match quantity
    }));

    // Calculate ticket totals from ticket tiers
    const totalTickets = ticketTiers.reduce((sum: number, tier: any) => sum + (tier.quantity || 0), 0);
    const availableTickets = ticketTiers.reduce((sum: number, tier: any) => sum + (tier.available || 0), 0);

    createMutation.mutate({
      ...eventData,
      image: imageUrl,
      startDate: new Date(eventData.startDate),
      endDate: new Date(eventData.endDate),
      ticketTiers,
      totalTickets,
      availableTickets,
      status: "active",
    });
  };

  const uploadImage = async (imageAsset: ImagePickerAsset) => {
    try {
      // Get presigned URL from your backend
      const presignedResponse = await axios.post(
        "https://offhu3yuna.execute-api.us-east-2.amazonaws.com/S3/upload-url",
        {
          fileName: `event-${Date.now()}.jpg`,
          fileType: "image/jpeg",
          userId: user?.id,
        }
      );

      const { uploadUrl, imageUrl } = presignedResponse.data;

      let uploadData: any;

      if (Platform.OS === "web") {
        // Web: Convert to blob for upload
        const response = await fetch(imageAsset.uri);
        const blob = await response.blob();
        uploadData = blob;
      } else {
        // Mobile: Use FormData
        const formData = new FormData();
        formData.append("file", {
          uri: imageAsset.uri,
          type: "image/jpeg",
          name: `event-${Date.now()}.jpg`,
        } as any);
        uploadData = formData;
      }

      // Upload to S3
      await axios.put(uploadUrl, uploadData, {
        headers: {
          "Content-Type":
            Platform.OS === "web" ? "image/jpeg" : "multipart/form-data",
        },
      });

      return imageUrl;
    } catch (error) {
      console.error("Image upload error:", error);
      if (Platform.OS === "web") {
        alert("Failed to upload image. Please try again.");
      } else {
        Alert.alert(
          "Upload Error",
          "Failed to upload image. Please try again."
        );
      }
    }
  };

  // Remove image handler: only delete from S3 if it's a remote URL
  const removeImage = async (image: string | { uri: string }) => {
    if (typeof image === "string" && image.startsWith("http")) {
      await deleteImage(getImageKey(image));
    }
    // No-op for local images
  };

  // Ticket tier management functions
  const addTicketTier = () => {
    const currentTiers = watch("ticketTiers") || [];
    const newTier = {
      id: Date.now().toString(), // Temporary ID for client-side management
      name: "",
      price: 0,
      quantity: 0,
      description: "",
    };
    setValue("ticketTiers", [...currentTiers, newTier]);
  };

  const removeTicketTier = (index: number) => {
    const currentTiers = watch("ticketTiers") || [];
    const updatedTiers = currentTiers.filter((_, i) => i !== index);
    setValue("ticketTiers", updatedTiers);
  };

  const updateTicketTier = (index: number, field: string, value: any) => {
    const currentTiers = watch("ticketTiers") || [];
    const updatedTiers = [...currentTiers];
    updatedTiers[index] = { ...updatedTiers[index], [field]: value };
    setValue("ticketTiers", updatedTiers);
  };

  return (
    <View style={{ padding: 16, gap: 24 }}>
      <View
        style={{
          backgroundColor: getColor("card", mode),
          borderRadius: 12,
          padding: 20,
          shadowColor: mode === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 0, 0, 0.3)",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8,
          borderWidth: 1,
          borderColor: getColor("borderLight", mode),
          gap: 20,
        }}
      >
        <ThemedText style={{ fontSize: 18, fontWeight: "700", letterSpacing: 0.3 }}>
          Event Details
        </ThemedText>

        <Controller
          control={control}
          name="title"
          rules={{ required: "Title is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              label="Event Title *"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter event title"
              error={errors.title?.message}
              Icon={FileText}
              colors={Colors[mode]}
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          rules={{ required: "Description is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              label="Description *"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Describe the event"
              error={errors.description?.message}
              multiline
              colors={Colors[mode]}
            />
          )}
        />

        <Controller
          control={control}
          name="note"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              label="Additional Notes"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Any additional information"
              multiline
              colors={Colors[mode]}
              error={errors.note?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="image"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomImageUploader
              label="Event Image"
              value={value}
              placeholder="Upload event image"
              colors={Colors[mode]}
              error={errors.image?.message}
              onChange={onChange}
              onBlur={onBlur}
              onImageDelete={removeImage}
            />
          )}
        />
      </View>

      <View
        style={{
          backgroundColor: getColor("card", mode),
          borderRadius: 12,
          padding: 20,
          shadowColor: mode === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 0, 0, 0.3)",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8,
          borderWidth: 1,
          borderColor: getColor("borderLight", mode),
          gap: 20,
        }}
      >
        <ThemedText style={{ fontSize: 18, fontWeight: "700", letterSpacing: 0.3 }}>
          Date & Time
        </ThemedText>

        <Controller
          control={control}
          name="startDate"
          rules={{ required: "Start date is required" }}
          render={({ field: { onChange, onBlur, value } }) =>
            Platform.OS === "web" ? (
              <CustomWebDatePicker
                label="Event Start Date *"
                value={watch("startDate")}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Select date"
                colors={Colors[mode]}
                minDate={new Date()}
                error={errors.startDate?.message}
              />
            ) : (
              <DateTimePicker
                testID="dateTimePicker"
                value={new Date(value)}
                mode={"datetime"}
                onChange={onChange}
                minimumDate={new Date()}
              />
            )
          }
        />

        <Controller
          control={control}
          name="endDate"
          rules={{ required: "End date is required" }}
          render={({ field: { onChange, onBlur, value } }) =>
            Platform.OS === "web" ? (
              <CustomWebDatePicker
                label="Event End Date *"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Select date"
                colors={Colors[mode]}
                minDate={new Date()}
                error={errors.endDate?.message}
              />
            ) : (
              <DateTimePicker
                testID="dateTimePicker"
                value={new Date(value)}
                mode={"datetime"}
                onChange={onChange}
                minimumDate={new Date()}
              />
            )
          }
        />

        <Controller
          control={control}
          name="timezone"
          rules={{ required: "Timezone is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomPicker
              label="Timezone *"
              value={value}
              onSelect={onChange}
              onBlur={onBlur}
              placeholder="Select timezone"
              options={COMMON_TIMEZONES}
              error={errors.timezone?.message}
              colors={Colors[mode]}
            />
          )}
        />
      </View>

      <View
        style={{
          backgroundColor: getColor("card", mode),
          borderRadius: 12,
          padding: 20,
          shadowColor: mode === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 0, 0, 0.3)",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8,
          borderWidth: 1,
          borderColor: getColor("borderLight", mode),
          gap: 20,
        }}
      >
        <ThemedText style={{ fontSize: 18, fontWeight: "700", letterSpacing: 0.3 }}>
          Event Format & Categories
        </ThemedText>

        <Controller
          control={control}
          name="format"
          rules={{ required: "Format is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomPicker
              label="Event Format *"
              value={value}
              onSelect={onChange}
              onBlur={onBlur}
              placeholder="Select format"
              options={EVENT_FORMATS}
              error={errors.format?.message}
              colors={Colors[mode]}
            />
          )}
        />

        <Controller
          control={control}
          name="disciplines"
          rules={{ required: "At least one discipline is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomMultiSelect
              label="Academic Disciplines *"
              values={value}
              onSelect={onChange}
              onBlur={onBlur}
              placeholder="Select disciplines"
              options={EVENT_DISCIPLINES}
              error={errors.disciplines?.message}
              Icon={Building}
              colors={Colors[mode]}
            />
          )}
        />

        <Controller
          control={control}
          name="languages"
          rules={{ required: "At least one language is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomMultiSelect
              label="Event Languages *"
              values={value}
              onSelect={onChange}
              onBlur={onBlur}
              placeholder="Select languages"
              options={EVENT_LANGUAGES}
              error={errors.languages?.message}
              Icon={Users}
              colors={Colors[mode]}
            />
          )}
        />

        <Controller
          control={control}
          name="access"
          rules={{ required: "Access level is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomPicker
              label="Access Level *"
              value={value}
              onSelect={onChange}
              onBlur={onBlur}
              placeholder="Select access level"
              options={EVENT_ACCESS_LEVELS}
              error={errors.access?.message}
              colors={Colors[mode]}
            />
          )}
        />
      </View>

      <View
        style={{
          backgroundColor: getColor("card", mode),
          borderRadius: 12,
          padding: 20,
          shadowColor: mode === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 0, 0, 0.3)",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8,
          borderWidth: 1,
          borderColor: getColor("borderLight", mode),
          gap: 20,
        }}
      >
        <ThemedText style={{ fontSize: 18, fontWeight: "700", letterSpacing: 0.3 }}>
          Event Type & Location
        </ThemedText>

        <Controller
          control={control}
          name="eventType"
          rules={{ required: "Event type is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomPicker
              label="Event Type *"
              value={value}
              onSelect={onChange}
              onBlur={onBlur}
              placeholder="Select event type"
              options={EVENT_TYPES}
              error={errors.eventType?.message}
              colors={Colors[mode]}
            />
          )}
        />

        {/* Location fields for In-Person and Hybrid events */}
        {(watch("eventType") === "In-Person" || watch("eventType") === "Hybrid") && (
          <>
            <Controller
              control={control}
              name="address.venue"
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  label="Venue Name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Enter venue name"
                  error={errors.address?.venue?.message}
                  Icon={Building}
                  colors={Colors[mode]}
                />
              )}
            />

            <Controller
              control={control}
              name="address.street"
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  label="Street Address"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Enter street address"
                  error={errors.address?.street?.message}
                  Icon={MapPin}
                  colors={Colors[mode]}
                />
              )}
            />

            <View style={{ flexDirection: "row", gap: 16 }}>
              <View style={{ flex: 1 }}>
                <Controller
                  control={control}
                  name="address.city"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomInput
                      label="City"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Enter city"
                      error={errors.address?.city?.message}
                      colors={Colors[mode]}
                    />
                  )}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Controller
                  control={control}
                  name="address.state"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomInput
                      label="State/Province"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Enter state"
                      error={errors.address?.state?.message}
                      colors={Colors[mode]}
                    />
                  )}
                />
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 16 }}>
              <View style={{ flex: 1 }}>
                <Controller
                  control={control}
                  name="address.zipCode"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomInput
                      label="ZIP/Postal Code"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Enter ZIP code"
                      error={errors.address?.zipCode?.message}
                      colors={Colors[mode]}
                    />
                  )}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Controller
                  control={control}
                  name="address.country"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomInput
                      label="Country"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Enter country"
                      error={errors.address?.country?.message}
                      colors={Colors[mode]}
                    />
                  )}
                />
              </View>
            </View>

            <Controller
              control={control}
              name="address.parkingAvailable"
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomPicker
                  label="Parking Available"
                  value={value}
                  onSelect={onChange}
                  onBlur={onBlur}
                  placeholder="Select parking availability"
                  options={[
                    { value: "Yes", label: "Yes" },
                    { value: "No", label: "No" },
                    { value: "Limited", label: "Limited" },
                  ]}
                  error={errors.address?.parkingAvailable?.message}
                  Icon={Car}
                  colors={Colors[mode]}
                />
              )}
            />

            {watch("address.parkingAvailable") === "Yes" && (
              <>
                <Controller
                  control={control}
                  name="address.parkingDetails"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomInput
                      label="Parking Details"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Describe parking options"
                      multiline
                      error={errors.address?.parkingDetails?.message}
                      colors={Colors[mode]}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="address.parkingInstructions"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomInput
                      label="Parking Instructions"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Any special parking instructions"
                      multiline
                      error={errors.address?.parkingInstructions?.message}
                      colors={Colors[mode]}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="address.parkingCost"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomInput
                      label="Parking Cost"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="e.g., $5, Free, $10/hour"
                      error={errors.address?.parkingCost?.message}
                      colors={Colors[mode]}
                    />
                  )}
                />
              </>
            )}
          </>
        )}

        {/* Video conference fields for Online and Hybrid events */}
        {(watch("eventType") === "Online" || watch("eventType") === "Hybrid") && (
          <>
            <Controller
              control={control}
              name="videoConference.platform"
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomPicker
                  label="Video Conference Platform"
                  value={value}
                  onSelect={onChange}
                  onBlur={onBlur}
                  placeholder="Select platform"
                  options={VIDEO_CONFERENCE_PLATFORMS}
                  error={errors.videoConference?.platform?.message}
                  Icon={Monitor}
                  colors={Colors[mode]}
                />
              )}
            />

            <Controller
              control={control}
              name="videoConference.link"
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  label="Meeting Link"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Enter meeting link"
                  error={errors.videoConference?.link?.message}
                  colors={Colors[mode]}
                />
              )}
            />

            <Controller
              control={control}
              name="videoConference.meetingId"
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  label="Meeting ID"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Enter meeting ID"
                  error={errors.videoConference?.meetingId?.message}
                  colors={Colors[mode]}
                />
              )}
            />

            <Controller
              control={control}
              name="videoConference.passcode"
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  label="Meeting Passcode"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Enter meeting passcode"
                  error={errors.videoConference?.passcode?.message}
                  colors={Colors[mode]}
                />
              )}
            />

            <Controller
              control={control}
              name="videoConference.instructions"
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  label="Join Instructions"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Any special instructions for joining"
                  multiline
                  error={errors.videoConference?.instructions?.message}
                  colors={Colors[mode]}
                />
              )}
            />
          </>
        )}

        <Controller
          control={control}
          name="source"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              label="Source Link"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Link to original event posting"
              error={errors.source?.message}
              colors={Colors[mode]}
            />
          )}
        />
      </View>

      <View
        style={{
          backgroundColor: getColor("card", mode),
          borderRadius: 12,
          padding: 20,
          shadowColor: mode === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 0, 0, 0.3)",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8,
          borderWidth: 1,
          borderColor: getColor("borderLight", mode),
          gap: 20,
        }}
      >
        <ThemedText style={{ fontSize: 18, fontWeight: "700", letterSpacing: 0.3 }}>
          Additional Features
        </ThemedText>

        <Controller
          control={control}
          name="featuredGuests"
          render={({ field: { onChange, onBlur, value } }) => (
            <FeaturedGuestsManager
              value={value}
              onChange={onChange}
              onImageDelete={removeImage}
            />
          )}
        />

        <Controller
          control={control}
          name="accessibilityFeatures"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomMultiSelect
              label="Accessibility Features"
              values={value}
              onSelect={onChange}
              onBlur={onBlur}
              placeholder="Select accessibility features"
              options={ACCESSIBILITY_FEATURES}
              error={errors.accessibilityFeatures?.message}
              Icon={Shield}
              colors={Colors[mode]}
            />
          )}
        />
      </View>

      <View
        style={{
          backgroundColor: getColor("card", mode),
          borderRadius: 12,
          padding: 20,
          shadowColor: mode === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 0, 0, 0.3)",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8,
          borderWidth: 1,
          borderColor: getColor("borderLight", mode),
          gap: 20,
        }}
      >
        <ThemedText style={{ fontSize: 18, fontWeight: "700", letterSpacing: 0.3 }}>
          Ticketing
        </ThemedText>

        <View style={{ gap: 20 }}>
          {watch("ticketTiers")?.map((tier, index) => (
            <View
              key={index}
              style={{
                backgroundColor: getColor("backgroundElevated", mode),
                borderRadius: 8,
                padding: 20,
                borderWidth: 1,
                borderColor: getColor("borderLight", mode),
                gap: 16,
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <ThemedText style={{ fontSize: 16, fontWeight: "600" }}>
                  Ticket Tier {index + 1}
                </ThemedText>
                <Button
                  onPress={() => removeTicketTier(index)}
                  variant="outline"
                  action="negative"
                  size="sm"
                  style={{ borderColor: getColor("error", mode) }}
                >
                  <ButtonIcon as={Trash2} />
                </Button>
              </View>

              <CustomInput
                label="Tier Name"
                value={tier.name}
                onChangeText={(value) => updateTicketTier(index, "name", value)}
                onBlur={() => { }}
                placeholder="e.g., General Admission"
                colors={Colors[mode]}
                Icon={Ticket}
              />

              <View style={{ flexDirection: "row", gap: 16 }}>
                <View style={{ flex: 1 }}>
                  <CustomInput
                    label="Price ($)"
                    value={tier.price?.toString() || ""}
                    onChangeText={(value) => updateTicketTier(index, "price", parseFloat(value) || 0)}
                    onBlur={() => { }}
                    placeholder="0.00"
                    colors={Colors[mode]}
                    keyboardType="numeric"
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <CustomInput
                    label="Quantity"
                    value={tier.quantity?.toString() || ""}
                    onChangeText={(value) => updateTicketTier(index, "quantity", parseInt(value) || 0)}
                    onBlur={() => { }}
                    placeholder="100"
                    colors={Colors[mode]}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <CustomInput
                label="Description"
                value={tier.description || ""}
                onChangeText={(value) => updateTicketTier(index, "description", value)}
                onBlur={() => { }}
                placeholder="Describe this ticket tier"
                multiline
                colors={Colors[mode]}
              />
            </View>
          ))}

          <Button
            onPress={addTicketTier}
            style={{
              backgroundColor: getColor("primary", mode),
              borderRadius: 8,
              shadowColor: getColor("primary", mode),
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <ButtonIcon as={Plus} color={"white"} />
            <ButtonText style={{ color: "white", fontWeight: "600" }}>Add Ticket Tier</ButtonText>
          </Button>
        </View>
      </View>

      <View
        style={{
          backgroundColor: getColor("card", mode),
          borderRadius: 12,
          padding: 20,
          shadowColor: mode === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 0, 0, 0.3)",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8,
          borderWidth: 1,
          borderColor: getColor("borderLight", mode),
        }}
      >
        <ThemedButton
          title={isSubmitting ? "Creating Event..." : "Create Event"}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          style={{
            backgroundColor: getColor("primary", mode),
            borderRadius: 12,
            paddingVertical: 16,
            shadowColor: getColor("primary", mode),
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 6,
          }}
        />
      </View>
    </View>
  );
};
