import { Colors, getColor } from "@/constants/Colors";
import { ACCESSIBILITY_FEATURES, COMMON_TIMEZONES, EVENT_DISCIPLINES, EVENT_DURATIONS, EVENT_FORMATS, EVENT_LANGUAGES, EVENT_TYPES, TIME_OF_DAY_OPTIONS, VIDEO_CONFERENCE_PLATFORMS } from "@/constants/Event";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { useEventFilters } from "@/hooks/useEventFilters";
import { AccessibilityFeature, PriceRange, SortBy } from "@/types";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Animated,
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
import { IconSymbol } from "./ui/IconSymbol";
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
        style,
        {
          backgroundColor: isSelected
            ? getColor("primary", mode)
            : getColor("backgroundElevated", mode),
          borderColor: isSelected
            ? getColor("primary", mode)
            : getColor("borderLight", mode),
          borderWidth: isSelected ? 1 : 0.5,
          borderRadius: 16,
          paddingHorizontal: 12,
          paddingVertical: 6,
          shadowColor: mode === "light" ? "rgba(0, 0, 0, 0.02)" : "rgba(0, 0, 0, 0.1)",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 1,
        },
      ]}
      activeOpacity={0.8}
    >
      <ThemedText
        style={[
          styles.filterButtonText,
          {
            color: isSelected
              ? getColor("primaryText", mode)
              : getColor("text", mode),
            fontWeight: isSelected ? "600" : "500",
            fontSize: 13,
            letterSpacing: 0.1,
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
  defaultExpanded?: boolean;
}

// A reusable section component for grouping filters
export const FilterSection = ({ title, children, defaultExpanded = false }: FilterSectionProps) => {
  const { mode } = useColorScheme();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [animatedValue] = useState(new Animated.Value(isExpanded ? 1 : 0));

  const toggleExpanded = () => {
    const newValue = !isExpanded;
    setIsExpanded(newValue);

    Animated.timing(animatedValue, {
      toValue: newValue ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const rotateInterpolate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  const opacityInterpolate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1],
  });

  return (
    <Animated.View
      style={[
        styles.filterSection,
        {
          backgroundColor: getColor("card", mode),
          borderRadius: 12,
          padding: 12,
          shadowColor: mode === "light" ? "rgba(0, 0, 0, 0.02)" : "rgba(0, 0, 0, 0.1)",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 1,
          borderWidth: 0.5,
          borderColor: getColor("border", mode),
          opacity: opacityInterpolate,
        }
      ]}
    >
      <TouchableOpacity
        style={[
          styles.sectionHeader,
          {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 4,
            borderRadius: 6,
            backgroundColor: "transparent",
          }
        ]}
        onPress={toggleExpanded}
        activeOpacity={0.8}
      >
        <ThemedText
          style={[
            styles.sectionTitle,
            {
              color: getColor("text", mode),
              fontSize: 16,
              fontWeight: "600",
              letterSpacing: 0.1,
            }
          ]}
        >
          {title}
        </ThemedText>
        <Animated.View
          style={[
            styles.chevronContainer,
            {
              backgroundColor: "transparent",
              borderRadius: 12,
              width: 24,
              height: 24,
              alignItems: "center",
              justifyContent: "center",
              transform: [{ rotate: rotateInterpolate }],
            }
          ]}
        >
          <IconSymbol
            name="chevron.right"
            size={12}
            color={getColor("text", mode)}
          />
        </Animated.View>
      </TouchableOpacity>
      {isExpanded && (
        <Animated.View
          style={{
            gap: 12,
            marginTop: 8,
            paddingHorizontal: 2,
            opacity: animatedValue,
          }}
        >
          {children}
        </Animated.View>
      )}
    </Animated.View>
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
        contentContainerStyle={{ ...styles.scrollContent, gap: 12 }}
      >
        <FilterSection title="Search" defaultExpanded={true}>
          <TextInput
            placeholder="Search events..."
            placeholderTextColor={getColor("inputPlaceholder", mode)}
            value={filters.searchTerm}
            onChangeText={(text) => updateFilters({ searchTerm: text })}
            style={[
              styles.searchInput,
              {
                backgroundColor: getColor("inputBackground", mode),
                borderColor: getColor("inputBorder", mode),
                color: getColor("text", mode),
              },
            ]}
          />
        </FilterSection>

        <FilterSection title="Date & Time Filtering" defaultExpanded={true}>
          <View style={styles.inputContainer}>
            {Platform.OS === "web" ? (
              <CustomWebDatePicker
                label="Start Date & Time"
                value={filters.startDateTime || ""}
                onChangeText={(dateTime: string) => updateStartDateTime(dateTime)}
                onBlur={() => { }}
                placeholder="Select start date & time"
                colors={Colors[mode]}
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
                  style={[
                    styles.textInput,
                    {
                      borderColor: getColor("inputBorder", mode) || (mode === "light" ? "#d6d3d1" : "#57534e"),
                      backgroundColor: getColor("inputBackground", mode),
                      opacity: 1.0,
                    },
                  ]}
                  onPress={() => setShowStartPicker(true)}
                >
                  <Text style={{
                    color: filters.startDateTime
                      ? getColor("text", mode)
                      : getColor("inputPlaceholder", mode),
                    fontSize: 16,
                    fontWeight: "400",
                  }}>
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

          <View style={[styles.inputContainer]}>
            {Platform.OS === "web" ? (
              <CustomWebDatePicker
                label="End Date & Time"
                value={filters.endDateTime || ""}
                onChangeText={(dateTime: string) => updateEndDateTime(dateTime)}
                onBlur={() => { }}
                placeholder="Select end date & time"
                colors={Colors[mode]}
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
                  style={[
                    styles.textInput,
                    {
                      borderColor: getColor("inputBorder", mode) || (mode === "light" ? "#d6d3d1" : "#57534e"),
                      backgroundColor: getColor("inputBackground", mode),
                      opacity: 1.0,
                    },
                  ]}
                  onPress={() => setShowEndPicker(true)}
                >
                  <Text style={{
                    color: filters.endDateTime
                      ? getColor("text", mode)
                      : getColor("inputPlaceholder", mode),
                    fontSize: 16,
                    fontWeight: "400",
                  }}>
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
                  borderColor: getColor("inputBorder", mode),
                  color: getColor("text", mode),
                },
              ]}
            />
          </View>

          <View style={[styles.inputContainer]}>
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
                  borderColor: getColor("inputBorder", mode),
                  color: getColor("text", mode),
                },
              ]}
            />
          </View>

          <View style={[styles.inputContainer]}>
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
                  borderColor: getColor("inputBorder", mode),
                  color: getColor("text", mode),
                },
              ]}
            />
          </View>

          <View style={[styles.inputContainer]}>
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
                  borderColor: getColor("inputBorder", mode),
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
                  borderColor: getColor("inputBorder", mode),
                  color: getColor("text", mode),
                },
              ]}
            />
          </View>

          <View style={[styles.inputContainer]}>
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
                  borderColor: getColor("inputBorder", mode),
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
              🔍 Active Filters
            </Text>
            <View style={styles.activeFiltersContainer}>
              {filters.format && (
                <View style={[
                  styles.activeFilter,
                  { backgroundColor: getColor("card", mode) + "80" }
                ]}>
                  <Text
                    style={[
                      styles.activeFilterText,
                      { color: getColor("text", mode) },
                    ]}
                  >
                    Format: {filters.format}
                  </Text>
                </View>
              )}
              {filters.disciplines.length > 0 && (
                <View style={[
                  styles.activeFilter,
                  { backgroundColor: getColor("card", mode) + "80" }
                ]}>
                  <Text
                    style={[
                      styles.activeFilterText,
                      { color: getColor("text", mode) },
                    ]}
                  >
                    Disciplines: {filters.disciplines.join(", ")}
                  </Text>
                </View>
              )}
              {filters.languages.length > 0 && (
                <View style={[
                  styles.activeFilter,
                  { backgroundColor: getColor("card", mode) + "80" }
                ]}>
                  <Text
                    style={[
                      styles.activeFilterText,
                      { color: getColor("text", mode) },
                    ]}
                  >
                    Languages: {filters.languages.join(", ")}
                  </Text>
                </View>
              )}
              {filters.eventType && (
                <View style={[
                  styles.activeFilter,
                  { backgroundColor: getColor("card", mode) + "80" }
                ]}>
                  <Text
                    style={[
                      styles.activeFilterText,
                      { color: getColor("text", mode) },
                    ]}
                  >
                    Event Type: {filters.eventType}
                  </Text>
                </View>
              )}
              {filters.startDateTime && (
                <View style={[
                  styles.activeFilter,
                  { backgroundColor: getColor("card", mode) + "80" }
                ]}>
                  <Text
                    style={[
                      styles.activeFilterText,
                      { color: getColor("text", mode) },
                    ]}
                  >
                    Start: {new Date(filters.startDateTime).toLocaleDateString()} {new Date(filters.startDateTime).toLocaleTimeString()}
                  </Text>
                </View>
              )}
              {filters.endDateTime && (
                <View style={[
                  styles.activeFilter,
                  { backgroundColor: getColor("card", mode) + "80" }
                ]}>
                  <Text
                    style={[
                      styles.activeFilterText,
                      { color: getColor("text", mode) },
                    ]}
                  >
                    End: {new Date(filters.endDateTime).toLocaleDateString()} {new Date(filters.endDateTime).toLocaleTimeString()}
                  </Text>
                </View>
              )}
              {filters.timezone && (
                <View style={[
                  styles.activeFilter,
                  { backgroundColor: getColor("card", mode) + "80" }
                ]}>
                  <Text
                    style={[
                      styles.activeFilterText,
                      { color: getColor("text", mode) },
                    ]}
                  >
                    Timezone: {COMMON_TIMEZONES.find((tz: { value: string; label: string }) => tz.value === filters.timezone)?.label}
                  </Text>
                </View>
              )}
              {filters.priceRange && (
                <View style={[
                  styles.activeFilter,
                  { backgroundColor: getColor("card", mode) + "80" }
                ]}>
                  <Text
                    style={[
                      styles.activeFilterText,
                      { color: getColor("text", mode) },
                    ]}
                  >
                    Price Range: {filters.priceRange}
                  </Text>
                </View>
              )}
              {filters.hasFeaturedGuests && (
                <View style={[
                  styles.activeFilter,
                  { backgroundColor: getColor("card", mode) + "80" }
                ]}>
                  <Text
                    style={[
                      styles.activeFilterText,
                      { color: getColor("text", mode) },
                    ]}
                  >
                    Has Featured Guests
                  </Text>
                </View>
              )}
              {filters.hasTickets && (
                <View style={[
                  styles.activeFilter,
                  { backgroundColor: getColor("card", mode) + "80" }
                ]}>
                  <Text
                    style={[
                      styles.activeFilterText,
                      { color: getColor("text", mode) },
                    ]}
                  >
                    Has Tickets
                  </Text>
                </View>
              )}
              {filters.videoConferencePlatform && (
                <View style={[
                  styles.activeFilter,
                  { backgroundColor: getColor("card", mode) + "80" }
                ]}>
                  <Text
                    style={[
                      styles.activeFilterText,
                      { color: getColor("text", mode) },
                    ]}
                  >
                    Video Platform: {filters.videoConferencePlatform}
                  </Text>
                </View>
              )}
              {filters.parkingAvailable && (
                <View style={[
                  styles.activeFilter,
                  { backgroundColor: getColor("card", mode) + "80" }
                ]}>
                  <Text
                    style={[
                      styles.activeFilterText,
                      { color: getColor("text", mode) },
                    ]}
                  >
                    Parking: {filters.parkingAvailable}
                  </Text>
                </View>
              )}
              {(filters.location?.city || filters.location?.state || filters.location?.venue || filters.location?.country) && (
                <View style={[
                  styles.activeFilter,
                  { backgroundColor: getColor("card", mode) + "80" }
                ]}>
                  <Text
                    style={[
                      styles.activeFilterText,
                      { color: getColor("text", mode) },
                    ]}
                  >
                    Location: {[filters.location?.city, filters.location?.state, filters.location?.venue, filters.location?.country].filter(Boolean).join(", ")}
                  </Text>
                </View>
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <View style={[
                  styles.activeFilter,
                  { backgroundColor: getColor("card", mode) + "80" }
                ]}>
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
                </View>
              )}
              {filters.searchTerm && (
                <View style={[
                  styles.activeFilter,
                  { backgroundColor: getColor("card", mode) + "80" }
                ]}>
                  <Text
                    style={[
                      styles.activeFilterText,
                      { color: getColor("text", mode) },
                    ]}
                  >
                    Search: &quot;{filters.searchTerm}&quot;
                  </Text>
                </View>
              )}
              {(filters.accessibilityFeatures && filters.accessibilityFeatures.length > 0) && (
                <View style={[
                  styles.activeFilter,
                  { backgroundColor: getColor("card", mode) + "80" }
                ]}>
                  <Text
                    style={[
                      styles.activeFilterText,
                      { color: getColor("text", mode) },
                    ]}
                  >
                    Accessibility Features: {filters.accessibilityFeatures.join(", ")}
                  </Text>
                </View>
              )}
              {filters.duration && (
                <View style={[
                  styles.activeFilter,
                  { backgroundColor: getColor("card", mode) + "80" }
                ]}>
                  <Text
                    style={[
                      styles.activeFilterText,
                      { color: getColor("text", mode) },
                    ]}
                  >
                    Duration: {filters.duration}
                  </Text>
                </View>
              )}
              {filters.timeOfDay && (
                <View style={[
                  styles.activeFilter,
                  { backgroundColor: getColor("card", mode) + "80" }
                ]}>
                  <Text
                    style={[
                      styles.activeFilterText,
                      { color: getColor("text", mode) },
                    ]}
                  >
                    Time of Day: {filters.timeOfDay}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

      <Button
        size="lg"
        variant="solid"
        action="negative"
        onPress={resetFilters}
        style={styles.resetButton}
      >
        <ButtonText style={styles.resetButtonText}>Reset All Filters</ButtonText>
      </Button>
    </VStack>
  );
};

export const styles = StyleSheet.create({
  vstack: {
    flex: 1,
    padding: 12,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  filterSection: {
    // Card styling is now applied inline in the component
  },
  sectionHeader: {
    // Header styling is now applied inline in the component
  },
  sectionTitle: {
    // Title styling is now applied inline in the component
  },
  chevronContainer: {
    // Chevron container styling is now applied inline in the component
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  filterButton: {
    justifyContent: "center",
    alignItems: "center",
    minHeight: 36,
    // Other styling is now applied inline in the component
  },
  formatButton: {
    minWidth: 90,
  },
  filterButtonText: {
    textAlign: "center",
    // Other styling is now applied inline in the component
  },
  searchInput: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 15,
    fontWeight: "400",
    minHeight: 44,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputContainer: {
    gap: 8,
  },
  textInput: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 15,
    fontWeight: "400",
    minHeight: 44,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activeFiltersSection: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 0.5,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activeFiltersSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.1,
  },
  activeFiltersContainer: {
    flexDirection: "column",
    gap: 6,
  },
  activeFilter: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    margin: 1,
    borderWidth: 0.5,
    backgroundColor: "rgba(14, 165, 233, 0.08)",
    borderColor: "rgba(14, 165, 233, 0.2)",
  },
  activeFilterText: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
    letterSpacing: 0.05,
  },
  resetButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  resetButtonText: {
    fontWeight: "600",
    fontSize: 15,
    letterSpacing: 0.1,
  },
  locationInput: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 16,
    fontWeight: "400",
    minHeight: 52,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  clearButton: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  priceInput: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 16,
    fontWeight: "400",
    minHeight: 52,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateInput: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 16,
    fontWeight: "400",
    minHeight: 52,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    marginVertical: 16,
    opacity: 0.7,
    letterSpacing: 0.2,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});
