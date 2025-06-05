import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { fetchAccesses } from "@/services/access";
import { fetchDisciplines } from "@/services/discipline";
import { createEvent } from "@/services/event";
import { fetchFormats } from "@/services/format";
import type { DisciplineName, Event, FormatName } from "@/types";
import { AccessName } from "@/types";
import { useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Building, Clock, FileText, MapPin } from "lucide-react";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import CustomInput from "./CustomInput";
import CustomMultiSelect from "./CustomMultiSelect";
import CustomPicker from "./CustomPicker";
import { ThemedButton } from "./ThemedButton";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Spinner } from "./ui/spinner";

const testEvent = {
  title: "Test Event",
  description: "Test Description",
  note: "Test Note",
  startDate: new Date().toISOString().slice(0, 16),
  endDate: new Date().toISOString().slice(0, 16),
  location: "McGill University",
  source: "https://example.com",
  format: "Lecture",
  disciplines: ["Sociology", "Anthropology"] as DisciplineName[],
  access: "Public",
  organizerId: "Test Organizer ID",
};

type EventFormProps = {
  initialEvent?: Event;
};

// Main Event Form Component
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

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      // navigate("/events");
      router.push("/events");
      // reset();
      reset();
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

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    // watch,
    // setValue,
  } = useForm({
    mode: "onTouched",
    defaultValues: testEvent ?? {
      title: initialEvent?.title || "",
      description: initialEvent?.description || "",
      note: initialEvent?.note || "",
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
      </ThemedView>

      <ThemedView>
        <ThemedText size="xl" bold className="mb-3">
          Date & Time
        </ThemedText>

        <Controller
          control={control}
          name="startDate"
          rules={{ required: "Start date is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              label="Start Date & Time *"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="YYYY-MM-DDTHH:MM"
              error={errors.startDate?.message}
              Icon={Clock}
              colors={Colors[mode]}
            />
          )}
        />

        <Controller
          control={control}
          name="endDate"
          rules={{ required: "End date is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              label="End Date & Time *"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="YYYY-MM-DDTHH:MM"
              error={errors.endDate?.message}
              Icon={Clock}
              colors={Colors[mode]}
            />
          )}
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

      <ThemedView>
        <ThemedButton
          title={
            createMutation.isPending
              ? "Saving..."
              : initialEvent
              ? "Update Event"
              : "Create Event"
          }
          onPress={handleSubmit(onSubmit)}
          disabled={createMutation.isPending}
        />
      </ThemedView>
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  pickerText: {
    fontSize: 16,
    paddingVertical: 12,
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  optionsList: {
    maxHeight: 400,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  selectedItemsContainer: {
    flex: 1,
    justifyContent: "center",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  tagText: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 4,
  },
  tagRemove: {
    marginLeft: 4,
  },
  tagsInputContainer: {
    flex: 1,
  },
  tagInputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  tagInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  addTagButton: {
    padding: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
  },
  submitButton: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
