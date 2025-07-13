import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { createEvent } from "@/services/event";
import { deleteImage } from "@/services/image";
import type { DisciplineName, Event, EventType, FormatName, VideoConferencePlatform } from "@/types";
import { AccessName } from "@/types";
import { getImageKey } from "@/utils/image";
import { useUser } from "@clerk/clerk-expo";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ImagePickerAsset } from "expo-image-picker";
import { router } from "expo-router";
import { Building, Car, FileText, MapPin, Monitor, Plus, Ticket, Trash2, Users } from "lucide-react";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Platform, View } from "react-native";
import CustomImageUploader from "./CustomImageUploader";
import CustomInput from "./CustomInput";
import CustomMultiSelect from "./CustomMultiSelect";
import CustomPicker from "./CustomPicker";
import CustomWebDatePicker from "./CustomWebDatePicker";
import { ThemedButton } from "./ThemedButton";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Button, ButtonIcon, ButtonText } from "./ui/button";

type EventFormProps = {
  initialEvent?: Event;
};

// Local data arrays for formats, disciplines, and access levels
const LOCAL_FORMATS: FormatName[] = [
  "Lecture",
  "Conference",
  "Seminar",
  "Colloquium",
  "Symposium",
  "Panel",
  "Roundtable",
  "Workshop",
  "Webinar",
  "Discussion",
  "Debate",
  "Book Talk",
  "Poster Session",
  "Networking Event",
  "Training Session",
  "Keynote",
  "Town Hall",
  "Fireside Chat",
];

const LOCAL_DISCIPLINES: DisciplineName[] = [
  "Political Science",
  "Economics",
  "History",
  "Sociology",
  "Anthropology",
  "Psychology",
  "Human Geography",
  "Linguistics",
  "Archaeology",
  "Law",
  "Education",
  "Communication Studies",
  "Development Studies",
  "International Relations",
  "Criminology",
  "Demography",
  "Social Work",
  "Cultural Studies",
  "Philosophy",
];

const LOCAL_ACCESSES: AccessName[] = ["Public", "Private", "Invitation Only"];

const LOCAL_EVENT_TYPES: EventType[] = ["In-Person", "Online", "Hybrid"];

const LOCAL_VIDEO_PLATFORMS: VideoConferencePlatform[] = ["Zoom", "Teams", "Google Meet", "WebEx", "GoToMeeting", "Other"];

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
      access: initialEvent?.access || "",
      organizerId: initialEvent?.organizerId || user?.id,
      ticketTiers: initialEvent?.ticketTiers || [],
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
    createMutation.mutate({
      ...eventData,
      image: imageUrl,
      startDate: new Date(eventData.startDate),
      endDate: new Date(eventData.endDate),
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
    <View className="gap-3">
      <ThemedView>
        <ThemedText size="xl" bold className="mb-3">
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
      </ThemedView>

      <ThemedView>
        <ThemedText size="xl" bold className="mb-3">
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
      </ThemedView>

      <ThemedView>
        <ThemedText size="xl" bold className="mb-3">
          Event Classification
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
              options={LOCAL_FORMATS}
              error={errors.format?.message}
              Icon={FileText}
              colors={Colors[mode]}
              placeholder="Select event format"
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
              options={LOCAL_DISCIPLINES}
              error={errors.disciplines?.message}
              Icon={Building}
              colors={Colors[mode]}
              placeholder="Select disciplines"
            />
          )}
        />
      </ThemedView>

      <ThemedView>
        <ThemedText size="xl" bold className="mb-3">
          Access
        </ThemedText>

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
              options={LOCAL_ACCESSES}
              colors={Colors[mode]}
              placeholder="Select access level"
              error={errors.access?.message}
            />
          )}
        />
      </ThemedView>

      <ThemedView>
        <ThemedText size="xl" bold className="mb-3">
          Organizer Information
        </ThemedText>

        <Controller
          control={control}
          name="source"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              label="Event Source/Website"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="https://example.com"
              colors={Colors[mode]}
              keyboardType="url"
              error={errors.source?.message}
            />
          )}
        />
      </ThemedView>

      <ThemedView>
        <ThemedText size="xl" bold className="mb-3">
          Event Type
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
              options={LOCAL_EVENT_TYPES}
              error={errors.eventType?.message}
              Icon={Users}
              colors={Colors[mode]}
              placeholder="Select event type"
            />
          )}
        />
      </ThemedView>


      {/* Conditional Location/Video Conference Section */}
      {(watch("eventType") === "In-Person" || watch("eventType") === "Hybrid") && (
        <ThemedView>
          <ThemedText size="xl" bold className="mb-3">
            Event Location
          </ThemedText>

          <Controller
            control={control}
            name="address.venue"
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="Venue Name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="University Conference Center, etc."
                error={errors.address?.venue?.message}
                Icon={Building}
                colors={Colors[mode]}
              />
            )}
          />

          <Controller
            control={control}
            name="address.street"
            rules={watch("eventType") === "In-Person" || watch("eventType") === "Hybrid" ? { required: "Street address is required" } : {}}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label={watch("eventType") === "In-Person" || watch("eventType") === "Hybrid" ? "Street Address *" : "Street Address"}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="123 Main Street"
                error={errors.address?.street?.message}
                Icon={MapPin}
                colors={Colors[mode]}
              />
            )}
          />

          <Controller
            control={control}
            name="address.city"
            rules={watch("eventType") === "In-Person" || watch("eventType") === "Hybrid" ? { required: "City is required" } : {}}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label={watch("eventType") === "In-Person" || watch("eventType") === "Hybrid" ? "City *" : "City"}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="New York"
                error={errors.address?.city?.message}
                colors={Colors[mode]}
              />
            )}
          />

          <Controller
            control={control}
            name="address.state"
            rules={watch("eventType") === "In-Person" || watch("eventType") === "Hybrid" ? { required: "State is required" } : {}}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label={watch("eventType") === "In-Person" || watch("eventType") === "Hybrid" ? "State/Province *" : "State/Province"}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="NY"
                error={errors.address?.state?.message}
                colors={Colors[mode]}
              />
            )}
          />

          <Controller
            control={control}
            name="address.zipCode"
            rules={watch("eventType") === "In-Person" || watch("eventType") === "Hybrid" ? { required: "ZIP code is required" } : {}}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label={watch("eventType") === "In-Person" || watch("eventType") === "Hybrid" ? "ZIP/Postal Code *" : "ZIP/Postal Code"}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="10001"
                error={errors.address?.zipCode?.message}
                colors={Colors[mode]}
              />
            )}
          />

          <Controller
            control={control}
            name="address.country"
            rules={watch("eventType") === "In-Person" || watch("eventType") === "Hybrid" ? { required: "Country is required" } : {}}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label={watch("eventType") === "In-Person" || watch("eventType") === "Hybrid" ? "Country *" : "Country"}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="United States"
                error={errors.address?.country?.message}
                colors={Colors[mode]}
              />
            )}
          />

          <ThemedText size="lg" bold className="mt-4 mb-3">
            Parking Information
          </ThemedText>

          <Controller
            control={control}
            name="address.parkingAvailable"
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomPicker
                label="Parking Available"
                value={value}
                onSelect={onChange}
                onBlur={onBlur}
                options={["Yes", "No", "Limited"]}
                error={errors.address?.parkingAvailable?.message}
                Icon={Car}
                colors={Colors[mode]}
                placeholder="Select parking availability"
              />
            )}
          />

          {watch("address.parkingAvailable") === "Yes" || watch("address.parkingAvailable") === "Limited" ? (
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
                    placeholder="e.g., On-site parking garage, Street parking available"
                    error={errors.address?.parkingDetails?.message}
                    colors={Colors[mode]}
                    multiline
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
                    placeholder="e.g., Free, $10/day, $5/hour"
                    error={errors.address?.parkingCost?.message}
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
                    placeholder="e.g., Enter from Main Street, validate ticket at front desk"
                    error={errors.address?.parkingInstructions?.message}
                    colors={Colors[mode]}
                    multiline
                  />
                )}
              />
            </>
          ) : null}
        </ThemedView>
      )}

      {/* Video Conference Section */}
      {(watch("eventType") === "Online" || watch("eventType") === "Hybrid") && (
        <ThemedView>
          <ThemedText size="xl" bold className="mb-3">
            Video Conference Details
          </ThemedText>

          <Controller
            control={control}
            name="videoConference.platform"
            rules={watch("eventType") === "Online" || watch("eventType") === "Hybrid" ? { required: "Platform is required" } : {}}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomPicker
                label={watch("eventType") === "Online" || watch("eventType") === "Hybrid" ? "Platform *" : "Platform"}
                value={value}
                onSelect={onChange}
                onBlur={onBlur}
                options={LOCAL_VIDEO_PLATFORMS}
                error={errors.videoConference?.platform?.message}
                Icon={Monitor}
                colors={Colors[mode]}
                placeholder="Select video platform"
              />
            )}
          />

          <Controller
            control={control}
            name="videoConference.link"
            rules={watch("eventType") === "Online" || watch("eventType") === "Hybrid" ? { required: "Meeting link is required" } : {}}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label={watch("eventType") === "Online" || watch("eventType") === "Hybrid" ? "Meeting Link *" : "Meeting Link"}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="https://zoom.us/j/123456789"
                error={errors.videoConference?.link?.message}
                colors={Colors[mode]}
                keyboardType="url"
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
                placeholder="123 456 789"
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
                label="Passcode"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Meeting passcode"
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
                label="Additional Instructions"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Any special instructions for joining the meeting"
                error={errors.videoConference?.instructions?.message}
                colors={Colors[mode]}
                multiline
              />
            )}
          />
        </ThemedView>
      )}

      <ThemedView>
        <ThemedText size="xl" bold className="mb-3">
          Ticket Tiers
        </ThemedText>

        {watch("ticketTiers")?.map((tier, index) => (
          <View key={tier.id || index} className="border rounded-lg p-3 mb-3" style={{ borderColor: Colors[mode].border }}>
            <View className="flex-row justify-between items-center mb-3">
              <ThemedText size="lg" bold>Tier {index + 1}</ThemedText>
              <Button
                size="sm"
                variant="solid"
                action="negative"
                onPress={() => removeTicketTier(index)}
              >
                <ButtonIcon as={Trash2} size="xs" color={"white"} />
              </Button>
            </View>

            <CustomInput
              label="Tier Name *"
              value={tier.name}
              onChangeText={(value) => updateTicketTier(index, "name", value)}
              onBlur={() => { }}
              placeholder="e.g., General Admission, VIP, Student"
              colors={Colors[mode]}
              Icon={Ticket}
            />

            <View className="flex-row gap-3">
              <View className="flex-1">
                <CustomInput
                  label="Price ($) *"
                  value={tier.price?.toString() || ""}
                  onChangeText={(value) => updateTicketTier(index, "price", parseFloat(value) || 0)}
                  onBlur={() => { }}
                  placeholder="0.00"
                  colors={Colors[mode]}
                  keyboardType="numeric"
                />
              </View>

              <View className="flex-1">
                <CustomInput
                  label="Quantity *"
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
              placeholder="Optional description for this tier"
              colors={Colors[mode]}
              multiline
            />
          </View>
        ))}

        <Button
          size="sm"
          variant="outline"
          action="primary"
          onPress={addTicketTier}
        >
          <ButtonIcon as={Plus} size="xs" />
          <ButtonText>Add Ticket Tier</ButtonText>
        </Button>
      </ThemedView>

      <ThemedButton
        title={
          isSubmitting
            ? "Saving..."
            : initialEvent
              ? "Update Event"
              : "Create Event"
        }
        onPress={handleSubmit(onSubmit)}
        disabled={!isValid || isSubmitting}
      />
    </View>
  );
};
