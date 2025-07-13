import { getColor } from "@/constants/Colors";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { useEventFilters } from "@/hooks/useEventFilters";
import { DisciplineName, FormatName, SortBy } from "@/types";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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

// Data for filters (moved outside for clarity)
export const formats: FormatName[] = [
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
export const disciplines: DisciplineName[] = [
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
export const sortOptions: { key: SortBy; label: string }[] = [
  { key: "startDate", label: "Start Date" },
  { key: "title", label: "Title" },
  { key: "createdAt", label: "Created" },
];

export const EventFilters = () => {
  const {
    filters,
    updateFilter,
    resetFilters,
    isLoadingFilters,
    toggleDiscipline,
  } = useEventFilters();
  const { mode } = useColorScheme();

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
        <FilterSection title="Sort by">
          <View style={styles.buttonRow}>
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
          <View style={styles.buttonRow}>
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

        <FilterSection title="Search">
          <TextInput
            placeholder="Search events..."
            placeholderTextColor={getColor("inputPlaceholder", mode)}
            value={filters.searchTerm}
            onChangeText={(text) => updateFilter("searchTerm", text)}
            style={[
              styles.searchInput,
              {
                backgroundColor: getColor("inputBackground", mode),
                borderColor: getColor("inputBorder", mode),
                color: getColor("inputText", mode),
              },
            ]}
          />
        </FilterSection>

        <FilterSection title="Date Range">
          <View style={styles.buttonRow}>
            <FilterButton label="Today" isSelected={filters.dateRange === "today"} onPress={() => updateFilter("dateRange", filters.dateRange === "today" ? "future" : "today")} />
            <FilterButton label="Tomorrow" isSelected={filters.dateRange === "tomorrow"} onPress={() => updateFilter("dateRange", filters.dateRange === "tomorrow" ? "future" : "tomorrow")} />
            <FilterButton label="This Week" isSelected={filters.dateRange === "thisWeek"} onPress={() => updateFilter("dateRange", filters.dateRange === "thisWeek" ? "future" : "thisWeek")} />
            <FilterButton label="This Weekend" isSelected={filters.dateRange === "thisWeekend"} onPress={() => updateFilter("dateRange", filters.dateRange === "thisWeekend" ? "future" : "thisWeekend")} />
            <FilterButton label="This Month" isSelected={filters.dateRange === "thisMonth"} onPress={() => updateFilter("dateRange", filters.dateRange === "thisMonth" ? "future" : "thisMonth")} />
          </View>
        </FilterSection>

        <FilterSection title="Format">
          <View style={styles.buttonRow}>
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
                style={styles.formatButton} // Using a more specific style name
              />
            ))}
          </View>
        </FilterSection>

        <FilterSection title="Disciplines">
          <View style={styles.buttonRow}>
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
      </ScrollView>

      {(filters.format ||
        filters.disciplines.length > 0 ||
        filters.searchTerm) && (
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
              {filters.searchTerm && (
                <Text
                  style={[
                    styles.activeFilterText,
                    { color: getColor("text", mode) },
                  ]}
                >
                  Search: {filters.searchTerm}
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
});
