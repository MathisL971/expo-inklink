import {
  accessTypes,
  disciplines,
  EventFilters,
  FilterButton,
  FilterSection,
  formats,
  sortOptions,
  styles,
} from "@/components/EventFilters";
import EventsContainer from "@/components/EventsContainer";
import { ThemedView } from "@/components/ThemedView";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetScrollView,
} from "@/components/ui/actionsheet";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { VStack } from "@/components/ui/vstack";
import { getColor } from "@/constants/Colors";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { useEventFilters } from "@/hooks/useEventFilters";
import { SlidersHorizontal } from "lucide-react-native";
import { useState } from "react";
import { Platform, TextInput, View } from "react-native";

export default function HomeScreen() {
  const { mode } = useColorScheme();

  const { filters, updateFilter, toggleDiscipline } = useEventFilters();

  const [showActionsheet, setShowActionsheet] = useState(false);

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
        <View className="flex-col gap-2 lg:hidden">
          <View className="flex-row gap-2 items-center justify-end">
            <TextInput
              placeholder="Search events..."
              placeholderTextColor={getColor("inputPlaceholder", mode)}
              value={filters.searchTerm}
              onChangeText={(text) => updateFilter("searchTerm", text)}
              style={[
                {
                  flex: 1,
                  borderWidth: 1,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderRadius: 8,
                  fontSize: 14,
                  backgroundColor: getColor("inputBackground", mode),
                  borderColor: getColor("inputBorder", mode),
                  color: getColor("inputText", mode),
                  maxWidth: 400,
                },
              ]}
            />

            <Button size="lg" className="rounded-full p-3" onPress={handleOpen}>
              <ButtonIcon as={SlidersHorizontal} />
            </Button>
          </View>
          <Divider />
        </View>

        <EventsContainer />

        <Actionsheet
          isOpen={showActionsheet}
          onClose={handleClose}
          preventScroll={false}
        >
          <ActionsheetBackdrop />
          <ActionsheetContent className="items-start max-h-[80%]">
            <ActionsheetDragIndicatorWrapper>
              <ActionsheetDragIndicator />
            </ActionsheetDragIndicatorWrapper>

            <ActionsheetScrollView>
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
                          filters.format === format ? null : format
                        )
                      }
                      style={styles.formatButton} // Using a more specific style name
                    />
                  ))}
                </View>
              </FilterSection>

              <FilterSection title="Access">
                <View style={styles.buttonRow}>
                  {accessTypes.map((access) => (
                    <FilterButton
                      key={access}
                      label={access}
                      isSelected={filters.access === access}
                      onPress={() =>
                        updateFilter(
                          "access",
                          filters.access === access ? null : access
                        )
                      }
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
            </ActionsheetScrollView>
          </ActionsheetContent>
        </Actionsheet>
      </VStack>
    </ThemedView>
  );
}
