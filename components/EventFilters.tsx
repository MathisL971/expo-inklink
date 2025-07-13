import { getColor } from "@/constants/Colors";
import { ACCESSIBILITY_FEATURES, COMMON_TIMEZONES, EVENT_DISCIPLINES, EVENT_DURATIONS, EVENT_FORMATS, EVENT_LANGUAGES, EVENT_TYPES, TIME_OF_DAY_OPTIONS, VIDEO_CONFERENCE_PLATFORMS } from "@/constants/Event";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { useEventFilters } from "@/hooks/useEventFilters";
import { AccessibilityFeature, PriceRange, SortBy } from "@/types";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import CustomWebDatePicker from "./CustomWebDatePicker";
import { ThemedText } from "./ThemedText";
import { Button, ButtonText } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { VStack } from "./ui/vstack";

interface FilterButtonProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  style?: any;
}

// A reusable button component for the filter UI
export const FilterButton = ({
  label,
  isSelected,
  onPress,
  style,
}: FilterButtonProps) => {
  const { mode } = useColorScheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.filterButton,
        style, // Allow additional styles to be passed in
        {
          backgroundColor: isSelected
            ? getColor("primary", mode)
            : getColor("card", mode),
          borderColor: isSelected
            ? getColor("primary", mode)
            : getColor("border", mode),
        },
      ]}
    >
      <ThemedText
        size="sm"
        style={[
          styles.filterButtonText,
          {
            color: isSelected
              ? getColor("primaryText", mode)
              : getColor("text", mode),
            fontWeight: isSelected ? "600" : "400",
          },
        ]}
      >
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
};

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

// A reusable section component for grouping filters
export const FilterSection = ({ title, children }: FilterSectionProps) => {
  const { mode } = useColorScheme();

  return (
    <View style={styles.filterSection}>
      <ThemedText
        style={[styles.sectionTitle, { color: getColor("text", mode) }]}
      >
        {title}
      </ThemedText>
      {children}
    </View>
  );
};

// Data for filters (using imported constants from Event.ts)
export const formats = EVENT_FORMATS;
export const disciplines = EVENT_DISCIPLINES;
export const languages = EVENT_LANGUAGES;
export const eventTypes = EVENT_TYPES;
export const videoConferencePlatforms = VIDEO_CONFERENCE_PLATFORMS;

export const priceRanges: { key: PriceRange; label: string }[] = [
  { key: "free", label: "Free ($0)" },
  { key: "paid", label: "Paid (Any Price)" },
  { key: "low", label: "Low ($0-$50)" },
  { key: "medium", label: "Medium ($50-$200)" },
  { key: "high", label: "High ($200+)" },
];

export const parkingOptions = [
  { key: "Yes", label: "Available" },
  { key: "No", label: "Not Available" },
  { key: "Limited", label: "Limited" },
];

export const sortOptions: { key: SortBy; label: string }[] = [
  { key: "startDate", label: "Start Date" },
  { key: "title", label: "Title" },
  { key: "createdAt", label: "Created" },
];

export const EventFilters = () => {
  const {
    filters,
    isLoadingFilters,
    resetFilters,
    updateFilters,
    toggleDiscipline,
    toggleLanguage,
    updateLocationFilter,
    clearLocationFilter,
    toggleFeaturedGuests,
    toggleHasTickets,
    updatePriceRange,
    clearPriceRange,
    updateStartDateTime,
    clearStartDateTime,
    updateEndDateTime,
    clearEndDateTime,
    updateTimezone,
    clearTimezone,
    toggleAccessibilityFeature,
    clearAccessibilityFeatures,
    updateDuration,
    clearDuration,
    updateTimeOfDay,
    clearTimeOfDay,
  } = useEventFilters();
  const { mode } = useColorScheme();
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  if (isLoadingFilters) {
    return (
      <VStack className="flex-1 justify-center items-center" style={{ minHeight: 200 }}>
        <Spinner size="large" />
      </VStack>
    );
  }

  return (
    <VStack style={styles.vstack}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <FilterSection title="Search">
          <TextInput
            placeholder="Search events..."
            placeholderTextColor={getColor("inputPlaceholder", mode)}
            value={filters.searchTerm}
            onChangeText={(text) => updateFilters({ searchTerm: text })}
            style={[
              styles.searchInput,
              {
                backgroundColor: getColor("inputBackground", mode),
                borderColor: getColor("border", mode),
                color: getColor("text", mode),
              },
            ]}
          />
        </FilterSection>

        <FilterSection title="Date & Time Filtering">
          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>Start Date & Time</ThemedText>
            {Platform.OS === "web" ? (
              <CustomWebDatePicker
                label="Start Date & Time"
                value={filters.startDateTime || ""}
                onChangeText={(dateTime: string) => updateStartDateTime(dateTime)}
                onBlur={() => { }}
                placeholder="Select start date & time"
                colors={{
                  inputBackground: getColor("inputBackground", mode),
                  border: getColor("border", mode),
                  text: getColor("text", mode),
                  inputPlaceholder: getColor("inputPlaceholder", mode),
                }}
              />
            ) : (
              <>
                {showStartPicker && (
                  <DateTimePicker
                    value={
                      filters.startDateTime
                        ? new Date(filters.startDateTime)
                        : new Date()
                    }
                    mode="datetime"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowStartPicker(false);
                      if (selectedDate) {
                        updateStartDateTime(selectedDate.toISOString());
                      }
                    }}
                  />
                )}
                <TouchableOpacity
                  style={[styles.textInput, { borderColor: getColor("border", mode) }]}
                  onPress={() => setShowStartPicker(true)}
                >
                  <Text style={{ color: getColor("text", mode) }}>
                    {filters.startDateTime
                      ? new Date(filters.startDateTime).toLocaleString()
                      : "Select start date & time"}
                  </Text>
                </TouchableOpacity>
              </>
            )}
            {filters.startDateTime && (
              <Button size="xs" variant="outline" onPress={() => clearStartDateTime()}>
                <ButtonText>Clear Start</ButtonText>
              </Button>
            )}
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>End Date & Time</ThemedText>
            {Platform.OS === "web" ? (
              <CustomWebDatePicker
                label="End Date & Time"
                value={filters.endDateTime || ""}
                onChangeText={(dateTime: string) => updateEndDateTime(dateTime)}
                onBlur={() => { }}
                placeholder="Select end date & time"
                colors={{
                  inputBackground: getColor("inputBackground", mode),
                  border: getColor("border", mode),
                  text: getColor("text", mode),
                  inputPlaceholder: getColor("inputPlaceholder", mode),
                }}
              />
            ) : (
              <>
                {showEndPicker && (
                  <DateTimePicker
                    value={
                      filters.endDateTime
                        ? new Date(filters.endDateTime)
                        : new Date()
                    }
                    mode="datetime"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowEndPicker(false);
                      if (selectedDate) {
                        updateEndDateTime(selectedDate.toISOString());
                      }
                    }}
                  />
                )}
                <TouchableOpacity
                  style={[styles.textInput, { borderColor: getColor("border", mode) }]}
                  onPress={() => setShowEndPicker(true)}
                >
                  <Text style={{ color: getColor("text", mode) }}>
                    {filters.endDateTime
                      ? new Date(filters.endDateTime).toLocaleString()
                      : "Select end date & time"}
                  </Text>
                </TouchableOpacity>
              </>
            )}
            {filters.endDateTime && (
              <Button size="xs" variant="outline" onPress={() => clearEndDateTime()}>
                <ButtonText>Clear End</ButtonText>
              </Button>
            )}
          </View>
        </FilterSection>

        <FilterSection title="Event Type">
          <View style={styles.buttonRow}>
            {EVENT_TYPES.map((type) => (
              <FilterButton
                key={type}
                label={type}
                isSelected={filters.eventType === type}
                onPress={() =>
                  updateFilters({
                    eventType: filters.eventType === type ? undefined : type,
                  })
                }
              />
            ))}
          </View>
        </FilterSection>

        <FilterSection title="Location">
          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>City</ThemedText>
            <TextInput
              placeholder="Enter city"
              placeholderTextColor={getColor("inputPlaceholder", mode)}
              value={filters.location?.city || ""}
              onChangeText={(text) =>
                updateLocationFilter({ city: text || undefined })
              }
              style={[
                styles.textInput,
                {
                  backgroundColor: getColor("inputBackground", mode),
                  borderColor: getColor("border", mode),
                  color: getColor("text", mode),
                },
              ]}
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>State/Province</ThemedText>
            <TextInput
              placeholder="Enter state or province"
              placeholderTextColor={getColor("inputPlaceholder", mode)}
              value={filters.location?.state || ""}
              onChangeText={(text) =>
                updateLocationFilter({ state: text || undefined })
              }
              style={[
                styles.textInput,
                {
                  backgroundColor: getColor("inputBackground", mode),
                  borderColor: getColor("border", mode),
                  color: getColor("text", mode),
                },
              ]}
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>Country</ThemedText>
            <TextInput
              placeholder="Enter country"
              placeholderTextColor={getColor("inputPlaceholder", mode)}
              value={filters.location?.country || ""}
              onChangeText={(text) =>
                updateLocationFilter({ country: text || undefined })
              }
              style={[
                styles.textInput,
                {
                  backgroundColor: getColor("inputBackground", mode),
                  borderColor: getColor("border", mode),
                  color: getColor("text", mode),
                },
              ]}
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>Venue</ThemedText>
            <TextInput
              placeholder="Enter venue name"
              placeholderTextColor={getColor("inputPlaceholder", mode)}
              value={filters.location?.venue || ""}
              onChangeText={(text) =>
                updateLocationFilter({ venue: text || undefined })
              }
              style={[
                styles.textInput,
                {
                  backgroundColor: getColor("inputBackground", mode),
                  borderColor: getColor("border", mode),
                  color: getColor("text", mode),
                },
              ]}
            />
          </View>

          {(filters.location?.city ||
            filters.location?.state ||
            filters.location?.country ||
            filters.location?.venue) && (
              <Button size="xs" variant="outline" onPress={() => clearLocationFilter()}>
                <ButtonText>Clear Location</ButtonText>
              </Button>
            )}
        </FilterSection>

        <FilterSection title="Format">
          <View style={styles.buttonRow}>
            {EVENT_FORMATS.map((format) => (
              <FilterButton
                key={format}
                label={format}
                isSelected={filters.format === format}
                onPress={() =>
                  updateFilters({
                    format: filters.format === format ? undefined : format,
                  })
                }
              />
            ))}
          </View>
        </FilterSection>

        <FilterSection title="Disciplines">
          <View style={styles.buttonRow}>
            {EVENT_DISCIPLINES.map((discipline) => (
              <FilterButton
                key={discipline}
                label={discipline}
                isSelected={filters.disciplines.includes(discipline)}
                onPress={() => toggleDiscipline(discipline)}
              />
            ))}
          </View>
        </FilterSection>

        <FilterSection title="Languages">
          <View style={styles.buttonRow}>
            {EVENT_LANGUAGES.map((language) => (
              <FilterButton
                key={language}
                label={language}
                isSelected={filters.languages.includes(language)}
                onPress={() => toggleLanguage(language)}
              />
            ))}
          </View>
        </FilterSection>

        <FilterSection title="Duration">
          <View style={styles.buttonRow}>
            {EVENT_DURATIONS.map((duration) => (
              <FilterButton
                key={duration}
                label={duration}
                isSelected={filters.duration === duration}
                onPress={() => {
                  if (filters.duration === duration) {
                    clearDuration();
                  } else {
                    updateDuration(duration);
                  }
                }}
              />
            ))}
          </View>
          {filters.duration && (
            <FilterButton
              label="Clear Duration"
              isSelected={false}
              onPress={() => clearDuration()}
            />
          )}
        </FilterSection>

        <FilterSection title="Time of Day">
          <View style={styles.buttonRow}>
            {TIME_OF_DAY_OPTIONS.map((timeOfDay) => (
              <FilterButton
                key={timeOfDay}
                label={timeOfDay}
                isSelected={filters.timeOfDay === timeOfDay}
                onPress={() => {
                  if (filters.timeOfDay === timeOfDay) {
                    clearTimeOfDay();
                  } else {
                    updateTimeOfDay(timeOfDay);
                  }
                }}
              />
            ))}
          </View>
          {filters.timeOfDay && (
            <FilterButton
              label="Clear Time of Day"
              isSelected={false}
              onPress={() => clearTimeOfDay()}
            />
          )}
        </FilterSection>

        <FilterSection title="Price Range">
          <View style={styles.buttonRow}>
            {priceRanges.map((range) => (
              <FilterButton
                key={range.key}
                label={range.label}
                isSelected={filters.priceRange === range.key}
                onPress={() =>
                  updateFilters({
                    priceRange:
                      filters.priceRange === range.key ? undefined : range.key,
                  })
                }
              />
            ))}
          </View>
        </FilterSection>

        <FilterSection title="Custom Price Range">
          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>Minimum Price ($)</ThemedText>
            <TextInput
              placeholder="0"
              placeholderTextColor={getColor("inputPlaceholder", mode)}
              value={filters.minPrice?.toString() || ""}
              onChangeText={(text) => {
                const price = text ? parseFloat(text) : undefined;
                updatePriceRange(price, filters.maxPrice);
              }}
              keyboardType="numeric"
              style={[
                styles.textInput,
                {
                  backgroundColor: getColor("inputBackground", mode),
                  borderColor: getColor("border", mode),
                  color: getColor("text", mode),
                },
              ]}
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>Maximum Price ($)</ThemedText>
            <TextInput
              placeholder="1000"
              placeholderTextColor={getColor("inputPlaceholder", mode)}
              value={filters.maxPrice?.toString() || ""}
              onChangeText={(text) => {
                const price = text ? parseFloat(text) : undefined;
                updatePriceRange(filters.minPrice, price);
              }}
              keyboardType="numeric"
              style={[
                styles.textInput,
                {
                  backgroundColor: getColor("inputBackground", mode),
                  borderColor: getColor("border", mode),
                  color: getColor("text", mode),
                },
              ]}
            />
          </View>

          {(filters.minPrice || filters.maxPrice) && (
            <Button size="xs" variant="outline" onPress={() => clearPriceRange()}>
              <ButtonText>Clear Custom Price Range</ButtonText>
            </Button>
          )}
        </FilterSection>

        <FilterSection title="Timezone">
          <View style={styles.buttonRow}>
            {COMMON_TIMEZONES.slice(0, 10).map((tz) => (
              <FilterButton
                key={tz.value}
                label={tz.label}
                isSelected={filters.timezone === tz.value}
                onPress={() => {
                  if (filters.timezone === tz.value) {
                    clearTimezone();
                  } else {
                    updateTimezone(tz.value);
                  }
                }}
              />
            ))}
          </View>
          {filters.timezone && (
            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>
                Selected Timezone: {COMMON_TIMEZONES.find(tz => tz.value === filters.timezone)?.label || filters.timezone}
              </ThemedText>
              <Button size="xs" variant="outline" onPress={() => clearTimezone()}>
                <ButtonText>Clear Timezone</ButtonText>
              </Button>
            </View>
          )}
        </FilterSection>

        <FilterSection title="Video Platform">
          <View style={styles.buttonRow}>
            {VIDEO_CONFERENCE_PLATFORMS.map((platform) => (
              <FilterButton
                key={platform}
                label={platform}
                isSelected={filters.videoConferencePlatform === platform}
                onPress={() =>
                  updateFilters({
                    videoConferencePlatform:
                      filters.videoConferencePlatform === platform
                        ? undefined
                        : platform,
                  })
                }
              />
            ))}
          </View>
        </FilterSection>

        <FilterSection title="Features">
          <View style={styles.buttonRow}>
            <FilterButton
              label="Featured Guests"
              isSelected={filters.hasFeaturedGuests === true}
              onPress={() => toggleFeaturedGuests()}
            />
            <FilterButton
              label="Has Tickets"
              isSelected={filters.hasTickets === true}
              onPress={() => toggleHasTickets()}
            />
          </View>
        </FilterSection>

        <FilterSection title="Parking">
          <View style={styles.buttonRow}>
            {parkingOptions.map((option) => (
              <FilterButton
                key={option.key}
                label={option.label}
                isSelected={filters.parkingAvailable === option.key}
                onPress={() =>
                  updateFilters({
                    parkingAvailable:
                      filters.parkingAvailable === option.key ? undefined : option.key,
                  })
                }
              />
            ))}
          </View>
        </FilterSection>

        <FilterSection title="Accessibility Features">
          <View style={styles.buttonRow}>
            {ACCESSIBILITY_FEATURES.map((feature) => (
              <FilterButton
                key={feature}
                label={feature}
                isSelected={filters.accessibilityFeatures?.includes(feature) || false}
                onPress={() => toggleAccessibilityFeature(feature as AccessibilityFeature)}
              />
            ))}
          </View>
          {filters.accessibilityFeatures && filters.accessibilityFeatures.length > 0 && (
            <FilterButton
              label="Clear Accessibility Features"
              isSelected={false}
              onPress={() => clearAccessibilityFeatures()}
            />
          )}
        </FilterSection>

        <FilterSection title="Sort by">
          <View style={styles.buttonRow}>
            {sortOptions.map((option) => (
              <FilterButton
                key={option.key}
                label={option.label}
                isSelected={filters.sortBy === option.key}
                onPress={() => updateFilters({ sortBy: option.key })}
              />
            ))}
          </View>
        </FilterSection>

        <FilterSection title="Sort Order">
          <View style={styles.buttonRow}>
            <FilterButton
              label="Ascending"
              isSelected={filters.sortOrder === "asc"}
              onPress={() => updateFilters({ sortOrder: "asc" })}
            />
            <FilterButton
              label="Descending"
              isSelected={filters.sortOrder === "desc"}
              onPress={() => updateFilters({ sortOrder: "desc" })}
            />
          </View>
        </FilterSection>
      </ScrollView>

      {(filters.format ||
        filters.disciplines.length > 0 ||
        filters.languages.length > 0 ||
        filters.searchTerm ||
        filters.eventType ||
        filters.startDateTime ||
        filters.endDateTime ||
        filters.priceRange ||
        filters.hasFeaturedGuests ||
        filters.hasTickets ||
        filters.videoConferencePlatform ||
        filters.parkingAvailable ||
        filters.location?.city ||
        filters.location?.state ||
        filters.location?.venue ||
        filters.location?.country ||
        filters.timezone ||
        filters.minPrice ||
        filters.maxPrice ||
        filters.duration ||
        filters.timeOfDay ||
        (filters.accessibilityFeatures && filters.accessibilityFeatures.length > 0)) && (
          <View
            style={[
              styles.activeFiltersSection,
              {
                backgroundColor: getColor("cardElevated", mode),
                borderColor: getColor("border", mode),
              },
            ]}
          >
            <Text
              style={[
                styles.activeFiltersSectionTitle,
                { color: getColor("text", mode) },
              ]}
            >
              Active Filters:
            </Text>
            <View style={styles.activeFiltersContainer}>
              {filters.format && (
                <Text
                  style={[
                    styles.activeFilterText,
                    { color: getColor("text", mode) },
                  ]}
                >
                  Format: {filters.format}
                </Text>
              )}
              {filters.disciplines.length > 0 && (
                <Text
                  style={[
                    styles.activeFilterText,
                    { color: getColor("text", mode) },
                  ]}
                >
                  Disciplines: {filters.disciplines.join(", ")}
                </Text>
              )}
              {filters.languages.length > 0 && (
                <Text
                  style={[
                    styles.activeFilterText,
                    { color: getColor("text", mode) },
                  ]}
                >
                  Languages: {filters.languages.join(", ")}
                </Text>
              )}
              {filters.eventType && (
                <Text
                  style={[
                    styles.activeFilterText,
                    { color: getColor("text", mode) },
                  ]}
                >
                  Event Type: {filters.eventType}
                </Text>
              )}
              {filters.startDateTime && (
                <Text
                  style={[
                    styles.activeFilterText,
                    { color: getColor("text", mode) },
                  ]}
                >
                  Start: {new Date(filters.startDateTime).toLocaleDateString()} {new Date(filters.startDateTime).toLocaleTimeString()}
                </Text>
              )}
              {filters.endDateTime && (
                <Text
                  style={[
                    styles.activeFilterText,
                    { color: getColor("text", mode) },
                  ]}
                >
                  End: {new Date(filters.endDateTime).toLocaleDateString()} {new Date(filters.endDateTime).toLocaleTimeString()}
                </Text>
              )}
              {filters.timezone && (
                <Text
                  style={[
                    styles.activeFilterText,
                    { color: getColor("text", mode) },
                  ]}
                >
                  Timezone: {COMMON_TIMEZONES.find((tz: { value: string; label: string }) => tz.value === filters.timezone)?.label}
                </Text>
              )}
              {filters.priceRange && (
                <Text
                  style={[
                    styles.activeFilterText,
                    { color: getColor("text", mode) },
                  ]}
                >
                  Price Range: {filters.priceRange}
                </Text>
              )}
              {filters.hasFeaturedGuests && (
                <Text
                  style={[
                    styles.activeFilterText,
                    { color: getColor("text", mode) },
                  ]}
                >
                  Has Featured Guests
                </Text>
              )}
              {filters.hasTickets && (
                <Text
                  style={[
                    styles.activeFilterText,
                    { color: getColor("text", mode) },
                  ]}
                >
                  Has Tickets
                </Text>
              )}
              {filters.videoConferencePlatform && (
                <Text
                  style={[
                    styles.activeFilterText,
                    { color: getColor("text", mode) },
                  ]}
                >
                  Video Platform: {filters.videoConferencePlatform}
                </Text>
              )}
              {filters.parkingAvailable && (
                <Text
                  style={[
                    styles.activeFilterText,
                    { color: getColor("text", mode) },
                  ]}
                >
                  Parking: {filters.parkingAvailable}
                </Text>
              )}
              {(filters.location?.city || filters.location?.state || filters.location?.venue || filters.location?.country) && (
                <Text
                  style={[
                    styles.activeFilterText,
                    { color: getColor("text", mode) },
                  ]}
                >
                  Location: {[filters.location?.city, filters.location?.state, filters.location?.venue, filters.location?.country].filter(Boolean).join(", ")}
                </Text>
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <Text
                  style={[
                    styles.activeFilterText,
                    { color: getColor("text", mode) },
                  ]}
                >
                  Price: {filters.minPrice ? `$${filters.minPrice}` : ""}
                  {filters.minPrice && filters.maxPrice ? " - " : ""}
                  {filters.maxPrice ? `$${filters.maxPrice}` : ""}
                </Text>
              )}
              {filters.searchTerm && (
                <Text
                  style={[
                    styles.activeFilterText,
                    { color: getColor("text", mode) },
                  ]}
                >
                  Search: &quot;{filters.searchTerm}&quot;
                </Text>
              )}
              {(filters.accessibilityFeatures && filters.accessibilityFeatures.length > 0) && (
                <Text
                  style={[
                    styles.activeFilterText,
                    { color: getColor("text", mode) },
                  ]}
                >
                  Accessibility Features: {filters.accessibilityFeatures.join(", ")}
                </Text>
              )}
              {filters.duration && (
                <Text
                  style={[
                    styles.activeFilterText,
                    { color: getColor("text", mode) },
                  ]}
                >
                  Duration: {filters.duration}
                </Text>
              )}
              {filters.timeOfDay && (
                <Text
                  style={[
                    styles.activeFilterText,
                    { color: getColor("text", mode) },
                  ]}
                >
                  Time of Day: {filters.timeOfDay}
                </Text>
              )}
            </View>
          </View>
        )}

      <Button
        size="md"
        variant="solid"
        action="negative"
        onPress={resetFilters}
      >
        <ButtonText>Reset Filters</ButtonText>
      </Button>
    </VStack>
  );
};

export const styles = StyleSheet.create({
  vstack: {
    flex: 1,
    padding: 16,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  filterSection: {
    marginBottom: 20,
    gap: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    margin: -4,
  },
  filterButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 4,
  },
  formatButton: {
    minWidth: 80,
  },
  filterButtonText: {
    textAlign: "center",
  },
  searchInput: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 14,
  },
  inputContainer: {
    gap: 8,
  },
  textInput: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 14,
  },
  activeFiltersSection: {
    marginTop: 12,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  activeFiltersSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  activeFiltersContainer: {
    flexDirection: "column",
    flexWrap: "wrap",
    margin: 4,
    gap: 4,
  },
  activeFilter: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
  },
  activeFilterText: {
    fontSize: 12,
    fontWeight: "500",
  },
  resetButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  resetButtonText: {
    fontWeight: "600",
    fontSize: 16,
  },
  locationInput: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 8,
  },
  clearButton: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  priceInput: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 8,
  },
  dateInput: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 8,
  },
  orText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    marginVertical: 8,
    opacity: 0.7,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
});
