import {
  disciplines,
  EventFilters,
  eventTypes,
  FilterButton,
  FilterSection,
  formats,
  languages,
  parkingOptions,
  priceRanges,
  sortOptions,
  styles,
  videoConferencePlatforms,
} from "@/components/EventFilters";
import EventsContainer from "@/components/EventsContainer";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetScrollView,
} from "@/components/ui/actionsheet";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { getColor } from "@/constants/Colors";
import {
  ACCESSIBILITY_FEATURES,
  COMMON_TIMEZONES,
  EVENT_DURATIONS,
  TIME_OF_DAY_OPTIONS,
} from "@/constants/Event";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { useEventFilters } from "@/hooks/useEventFilters";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SlidersHorizontal } from "lucide-react-native";
import { useState } from "react";
import { Platform, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const { mode } = useColorScheme();

  const {
    filters,
    updateFilter,
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
    updateDuration,
    clearDuration,
    updateTimeOfDay,
    clearTimeOfDay,
    toggleAccessibilityFeature,
    clearAccessibilityFeatures,
    resetFilters,
  } = useEventFilters();

  const [showActionsheet, setShowActionsheet] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleClose = () => setShowActionsheet(false);

  const handleOpen = () => setShowActionsheet(true);

  return (
    <ThemedView className="flex-1 flex-row">
      {Platform.OS === "web" && (
        <VStack
          className="hidden lg:flex"
          style={{
            backgroundColor: getColor("card", mode),
            width: "25%",
          }}
        >
          <EventFilters />
        </VStack>
      )}
      <VStack
        className="flex-1 p-3"
        style={{
          width:
            Platform.OS === "web" && window.innerWidth > 1024 ? "75%" : "100%",
        }}
      >
        <View className="flex-col lg:hidden" style={{ gap: 12 }}>
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}>
            <TextInput
              placeholder="Search events..."
              placeholderTextColor={getColor("inputPlaceholder", mode)}
              value={filters.searchTerm}
              onChangeText={(text) => updateFilter("searchTerm", text)}
              style={{
                flex: 1,
                borderWidth: 1,
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderRadius: 12,
                fontSize: 16,
                height: 44,
                backgroundColor: getColor("inputBackground", mode),
                borderColor: getColor("inputBorder", mode),
                color: getColor("text", mode),
                shadowColor: getColor("shadow", mode),
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
                fontWeight: "400",
              }}
            />

            <TouchableOpacity
              onPress={handleOpen}
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: getColor("primary", mode),
                alignItems: "center",
                justifyContent: "center",
                shadowColor: getColor("shadow", mode),
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
                elevation: 4,
              }}
              activeOpacity={0.8}
            >
              <SlidersHorizontal
                size={24}
                color={"white"}
                strokeWidth={2}
              />
            </TouchableOpacity>
          </View>

          <View style={{
            height: 1,
            backgroundColor: getColor("border", mode),
            marginHorizontal: -20,
            opacity: 0.5,
          }} />
        </View>

        <EventsContainer />

        <Actionsheet
          isOpen={showActionsheet}
          onClose={handleClose}
          preventScroll={false}
        >
          <ActionsheetBackdrop />
          <ActionsheetContent
            className="items-stretch"
            style={{
              backgroundColor: getColor("background", mode),
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              maxHeight: '80%',
              height: '80%',
            }}
          >
            <ActionsheetDragIndicatorWrapper>
              <ActionsheetDragIndicator />
            </ActionsheetDragIndicatorWrapper>

            {/* Header */}
            <View style={{
              paddingHorizontal: 20,
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: getColor("border", mode),
              backgroundColor: getColor("background", mode),
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              flexShrink: 0,
            }}>
              <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <ThemedText style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: getColor("text", mode),
                  letterSpacing: 0.2,
                }}>
                  Filter Events
                </ThemedText>
                <TouchableOpacity
                  onPress={handleClose}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: getColor("backgroundElevated", mode),
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: getColor("textSecondary", mode),
                  }}>
                    ×
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <ActionsheetScrollView
              showsVerticalScrollIndicator={false}
              style={{
                backgroundColor: getColor("background", mode),
                flex: 1,
              }}
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingTop: 16,
                paddingBottom: 20, // Account for fixed bottom button
                gap: 12,
              }}
            >
              <FilterSection title="Sort by">
                <View style={[styles.buttonRow, { gap: 8 }]}>
                  {sortOptions.map((option) => (
                    <FilterButton
                      key={option.key}
                      label={option.label}
                      isSelected={filters.sortBy === option.key}
                      onPress={() => updateFilter("sortBy", option.key)}
                    />
                  ))}
                </View>
              </FilterSection>

              <FilterSection title="Sort Order">
                <View style={[styles.buttonRow, { gap: 8 }]}>
                  <FilterButton
                    label="Ascending"
                    isSelected={filters.sortOrder === "asc"}
                    onPress={() => updateFilter("sortOrder", "asc")}
                  />
                  <FilterButton
                    label="Descending"
                    isSelected={filters.sortOrder === "desc"}
                    onPress={() => updateFilter("sortOrder", "desc")}
                  />
                </View>
              </FilterSection>

              <FilterSection title="Start Date & Time">
                <View style={{ gap: 12 }}>
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
                    style={{
                      borderWidth: 1,
                      borderColor: getColor("inputBorder", mode),
                      backgroundColor: getColor("inputBackground", mode),
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      borderRadius: 12,
                      minHeight: 52,
                      justifyContent: "center",
                      shadowColor: getColor("shadow", mode),
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 2,
                    }}
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
                  {filters.startDateTime && (
                    <Button
                      size="sm"
                      variant="outline"
                      onPress={() => clearStartDateTime()}
                      style={{
                        alignSelf: "flex-start",
                        paddingHorizontal: 16,
                      }}
                    >
                      <ButtonText>Clear Start</ButtonText>
                    </Button>
                  )}
                </View>
              </FilterSection>

              <FilterSection title="End Date & Time">
                <View style={{ gap: 12 }}>
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
                    style={{
                      borderWidth: 1,
                      borderColor: getColor("inputBorder", mode),
                      backgroundColor: getColor("inputBackground", mode),
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      borderRadius: 12,
                      minHeight: 52,
                      justifyContent: "center",
                      shadowColor: getColor("shadow", mode),
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 2,
                    }}
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
                  {filters.endDateTime && (
                    <Button
                      size="sm"
                      variant="outline"
                      onPress={() => clearEndDateTime()}
                      style={{
                        alignSelf: "flex-start",
                        paddingHorizontal: 16,
                      }}
                    >
                      <ButtonText>Clear End</ButtonText>
                    </Button>
                  )}
                </View>
              </FilterSection>

              <FilterSection title="Event Type">
                <View style={[styles.buttonRow, { gap: 8 }]}>
                  {eventTypes.map((type) => (
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
                <View style={{ gap: 12 }}>
                  {[
                    { placeholder: "City", value: filters.location?.city, key: "city" },
                    { placeholder: "State/Province", value: filters.location?.state, key: "state" },
                    { placeholder: "Country", value: filters.location?.country, key: "country" },
                    { placeholder: "Venue", value: filters.location?.venue, key: "venue" },
                  ].map((field) => (
                    <TextInput
                      key={field.key}
                      placeholder={field.placeholder}
                      placeholderTextColor={getColor("inputPlaceholder", mode)}
                      value={field.value || ""}
                      onChangeText={(text) =>
                        updateLocationFilter({ [field.key]: text || undefined })
                      }
                      style={{
                        borderWidth: 1,
                        borderColor: getColor("inputBorder", mode),
                        backgroundColor: getColor("inputBackground", mode),
                        paddingHorizontal: 16,
                        paddingVertical: 14,
                        borderRadius: 12,
                        fontSize: 16,
                        color: getColor("text", mode),
                        minHeight: 52,
                        shadowColor: getColor("shadow", mode),
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 2,
                      }}
                    />
                  ))}
                  {(filters.location?.city ||
                    filters.location?.state ||
                    filters.location?.country ||
                    filters.location?.venue) && (
                      <Button
                        size="sm"
                        variant="outline"
                        onPress={() => clearLocationFilter()}
                        style={{
                          alignSelf: "flex-start",
                          paddingHorizontal: 16,
                        }}
                      >
                        <ButtonText>Clear Location</ButtonText>
                      </Button>
                    )}
                </View>
              </FilterSection>

              <FilterSection title="Format">
                <View style={[styles.buttonRow, { gap: 8 }]}>
                  {formats.map((format) => (
                    <FilterButton
                      key={format}
                      label={format}
                      isSelected={filters.format === format}
                      onPress={() =>
                        updateFilter(
                          "format",
                          filters.format === format ? undefined : format
                        )
                      }
                    />
                  ))}
                </View>
              </FilterSection>

              <FilterSection title="Disciplines">
                <View style={[styles.buttonRow, { gap: 8 }]}>
                  {disciplines.map((discipline) => (
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
                <View style={[styles.buttonRow, { gap: 8 }]}>
                  {languages.map((language) => (
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
                <View style={{ gap: 12 }}>
                  <View style={[styles.buttonRow, { gap: 8 }]}>
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
                    <Button
                      size="sm"
                      variant="outline"
                      onPress={() => clearDuration()}
                      style={{
                        alignSelf: "flex-start",
                        paddingHorizontal: 16,
                      }}
                    >
                      <ButtonText>Clear Duration</ButtonText>
                    </Button>
                  )}
                </View>
              </FilterSection>

              <FilterSection title="Time of Day">
                <View style={{ gap: 12 }}>
                  <View style={[styles.buttonRow, { gap: 8 }]}>
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
                    <Button
                      size="sm"
                      variant="outline"
                      onPress={() => clearTimeOfDay()}
                      style={{
                        alignSelf: "flex-start",
                        paddingHorizontal: 16,
                      }}
                    >
                      <ButtonText>Clear Time of Day</ButtonText>
                    </Button>
                  )}
                </View>
              </FilterSection>

              <FilterSection title="Price Range">
                <View style={[styles.buttonRow, { gap: 8 }]}>
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
                <View style={{ gap: 12 }}>
                  <View style={{ gap: 8 }}>
                    <ThemedText style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: getColor("text", mode),
                      letterSpacing: 0.2,
                    }}>
                      Minimum Price ($)
                    </ThemedText>
                    <TextInput
                      placeholder="0"
                      placeholderTextColor={getColor("inputPlaceholder", mode)}
                      value={filters.minPrice?.toString() || ""}
                      onChangeText={(text) => {
                        const price = text ? parseFloat(text) : undefined;
                        updatePriceRange(price, filters.maxPrice);
                      }}
                      keyboardType="numeric"
                      style={{
                        borderWidth: 1,
                        borderColor: getColor("inputBorder", mode),
                        backgroundColor: getColor("inputBackground", mode),
                        paddingHorizontal: 16,
                        paddingVertical: 14,
                        borderRadius: 12,
                        fontSize: 16,
                        color: getColor("text", mode),
                        minHeight: 52,
                        shadowColor: getColor("shadow", mode),
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 2,
                      }}
                    />
                  </View>
                  <View style={{ gap: 8 }}>
                    <ThemedText style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: getColor("text", mode),
                      letterSpacing: 0.2,
                    }}>
                      Maximum Price ($)
                    </ThemedText>
                    <TextInput
                      placeholder="1000"
                      placeholderTextColor={getColor("inputPlaceholder", mode)}
                      value={filters.maxPrice?.toString() || ""}
                      onChangeText={(text) => {
                        const price = text ? parseFloat(text) : undefined;
                        updatePriceRange(filters.minPrice, price);
                      }}
                      keyboardType="numeric"
                      style={{
                        borderWidth: 1,
                        borderColor: getColor("inputBorder", mode),
                        backgroundColor: getColor("inputBackground", mode),
                        paddingHorizontal: 16,
                        paddingVertical: 14,
                        borderRadius: 12,
                        fontSize: 16,
                        color: getColor("text", mode),
                        minHeight: 52,
                        shadowColor: getColor("shadow", mode),
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 2,
                      }}
                    />
                  </View>
                  {(filters.minPrice || filters.maxPrice) && (
                    <Button
                      size="sm"
                      variant="outline"
                      onPress={() => clearPriceRange()}
                      style={{
                        alignSelf: "flex-start",
                        paddingHorizontal: 16,
                      }}
                    >
                      <ButtonText>Clear Price Range</ButtonText>
                    </Button>
                  )}
                </View>
              </FilterSection>

              <FilterSection title="Timezone">
                <View style={{ gap: 12 }}>
                  <View style={[styles.buttonRow, { gap: 8 }]}>
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
                    <View style={{ gap: 8 }}>
                      <ThemedText style={{
                        fontSize: 14,
                        color: getColor("textSecondary", mode),
                        fontWeight: "500",
                      }}>
                        Selected: {COMMON_TIMEZONES.find((tz) => tz.value === filters.timezone)?.label || filters.timezone}
                      </ThemedText>
                      <Button
                        size="sm"
                        variant="outline"
                        onPress={() => clearTimezone()}
                        style={{
                          alignSelf: "flex-start",
                          paddingHorizontal: 16,
                        }}
                      >
                        <ButtonText>Clear Timezone</ButtonText>
                      </Button>
                    </View>
                  )}
                </View>
              </FilterSection>

              <FilterSection title="Video Platform">
                <View style={[styles.buttonRow, { gap: 8 }]}>
                  {videoConferencePlatforms.map((platform) => (
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
                <View style={[styles.buttonRow, { gap: 8 }]}>
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
                <View style={[styles.buttonRow, { gap: 8 }]}>
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
                <View style={{ gap: 12 }}>
                  <View style={[styles.buttonRow, { gap: 8 }]}>
                    {ACCESSIBILITY_FEATURES.map((feature) => (
                      <FilterButton
                        key={feature}
                        label={feature}
                        isSelected={filters.accessibilityFeatures?.includes(feature) || false}
                        onPress={() => toggleAccessibilityFeature(feature)}
                      />
                    ))}
                  </View>
                  {filters.accessibilityFeatures && filters.accessibilityFeatures.length > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onPress={() => clearAccessibilityFeatures()}
                      style={{
                        alignSelf: "flex-start",
                        paddingHorizontal: 16,
                      }}
                    >
                      <ButtonText>Clear Accessibility Features</ButtonText>
                    </Button>
                  )}
                </View>
              </FilterSection>
            </ActionsheetScrollView>

            {/* Fixed Bottom Reset Button */}
            <View style={{
              paddingHorizontal: 20,
              paddingVertical: 16,
              backgroundColor: getColor("background", mode),
              borderTopWidth: 1,
              borderTopColor: getColor("border", mode),
              shadowColor: getColor("shadow", mode),
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 8,
              flexShrink: 0,
            }}>
              <Button
                size="lg"
                variant="solid"
                action="negative"
                onPress={() => resetFilters()}
                style={styles.resetButton}
              >
                <ButtonText style={styles.resetButtonText}>
                  Reset All Filters
                </ButtonText>
              </Button>
            </View>
          </ActionsheetContent>
        </Actionsheet>
      </VStack>
    </ThemedView>
  );
}
