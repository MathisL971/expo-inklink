import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { createEvent } from "@/services/event";
import { deleteImage } from "@/services/image";
import type { DisciplineName, Event, FormatName } from "@/types";
import { AccessName } from "@/types";
import { getImageKey } from "@/utils/image";
import { useUser } from "@clerk/clerk-expo";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ImagePickerAsset } from "expo-image-picker";
import { router } from "expo-router";
import { Building, FileText, MapPin } from "lucide-react";
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

export const EventForm = ({ initialEvent }: EventFormProps) => {
  const { user } = useUser();

  const { mode } = useColorScheme();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    watch,
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      title: initialEvent?.title || "",
      description: initialEvent?.description || "",
      note: initialEvent?.note || "",
      image: initialEvent?.image || "",
      startDate: initialEvent?.startDate || "",
      endDate: initialEvent?.endDate || "",
      location: initialEvent?.location || "",
      source: initialEvent?.source || "",
      format: initialEvent?.format || "",
      disciplines: initialEvent?.disciplines || [],
      access: initialEvent?.access || "",
      organizerId: initialEvent?.organizerId || user?.id,
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

        <Controller
          control={control}
          name="location"
          rules={{ required: "Location is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              label="Location *"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Event location or online link"
              error={errors.location?.message}
              Icon={MapPin}
              colors={Colors[mode]}
            />
          )}
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
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomPicker
              label="Access Level"
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
