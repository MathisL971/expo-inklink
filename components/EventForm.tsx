import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { fetchAccesses } from "@/services/access";
import { fetchDisciplines } from "@/services/discipline";
import { createEvent } from "@/services/event";
import { fetchFormats } from "@/services/format";
import { deleteImage } from "@/services/image";
import type { DisciplineName, Event, FormatName } from "@/types";
import { AccessName } from "@/types";
import { getImageKey } from "@/utils/image";
import { useUser } from "@clerk/clerk-expo";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Spinner } from "./ui/spinner";

type EventFormProps = {
  initialEvent?: Event;
};

export const EventForm = ({ initialEvent }: EventFormProps) => {
  const { user } = useUser();

  const { mode } = useColorScheme();

  const formatQuery = useQuery({
    queryKey: ["formats"],
    queryFn: fetchFormats,
    staleTime: 5 * 60 * 1000,
  });

  const disciplineQuery = useQuery({
    queryKey: ["disciplines"],
    queryFn: fetchDisciplines,
    staleTime: 5 * 60 * 1000,
  });

  const accessQuery = useQuery({
    queryKey: ["accesses"],
    queryFn: fetchAccesses,
    staleTime: 5 * 60 * 1000,
  });

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

  const onSubmit = async (eventData: any) => {
    createMutation.mutate({
      ...eventData,
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

  const removeImage = async (image: string) => {
    await deleteImage(getImageKey(image));
  };

  const loadingFieldOptions =
    formatQuery.isLoading || disciplineQuery.isLoading || accessQuery.isLoading;
  const errorFieldOptions =
    formatQuery.isError || disciplineQuery.isError || accessQuery.isError;
  const noDataFieldOptions =
    !formatQuery.data?.formats ||
    !disciplineQuery.data?.disciplines ||
    !accessQuery.data?.accesses;

  if (loadingFieldOptions) return <Spinner size={"large"} className="flex-1" />;

  if (errorFieldOptions)
    return (
      <View>
        <ThemedText>An error occured while loading field options...</ThemedText>
      </View>
    );

  if (noDataFieldOptions)
    return (
      <View>
        <ThemedText>Some field options data is missing...</ThemedText>
      </View>
    );

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
              onImageSelect={uploadImage}
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
              options={
                formatQuery.data?.formats.map((f) => f.name) ??
                ([] as FormatName[])
              }
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
              options={
                disciplineQuery.data?.disciplines.map((d) => d.name) ??
                ([] as DisciplineName[])
              }
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
              options={
                accessQuery.data?.accesses.map((a) => a.name) ??
                ([] as AccessName[])
              }
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
