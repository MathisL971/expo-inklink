import { getColor } from '@/constants/Colors';
import { useColorScheme } from '@/contexts/ColorSchemeContext';
import { useEventFilters } from '@/hooks/useEventFilters';
import { AccessName, DisciplineName, FormatName, SortBy } from '@/types';
import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { Spinner } from './ui/spinner';
import { VStack } from './ui/vstack';

interface FilterButtonProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  style?: any;
}

// A reusable button component for the filter UI
const FilterButton = ({ label, isSelected, onPress, style } : FilterButtonProps) => {
  const { mode } = useColorScheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.filterButton,
        style, // Allow additional styles to be passed in
        {
          backgroundColor: isSelected ? getColor('primary', mode) : getColor('card', mode),
          borderColor: isSelected ? getColor('primary', mode) : getColor('border', mode),
        }
      ]}
    >
      <ThemedText style={[
        styles.filterButtonText,
        {
          color: isSelected ? getColor('primaryText', mode) : getColor('text', mode),
          fontWeight: isSelected ? '600' : '400',
        }
      ]}>
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
const FilterSection = ({ title, children }: FilterSectionProps) => {
  const { mode } = useColorScheme();
  
  return (
    <View style={styles.filterSection}>
      <ThemedText style={[styles.sectionTitle, { color: getColor('text', mode) }]}>
        {title}
      </ThemedText>
      {children}
    </View>
  );
};

export const EventFilters = () => {
  const { filters, updateFilter, resetFilters, isLoadingFilters, toggleDiscipline } = useEventFilters();
  const { mode } = useColorScheme();

  if (isLoadingFilters) {
    return <Spinner />;
  }

  // Data for filters (moved outside for clarity)
  const formats: FormatName[] = ["Lecture", "Conference", "Seminar", "Colloquium", "Symposium", "Panel", "Roundtable", "Workshop", "Webinar", "Discussion", "Debate", "Book Talk", "Poster Session", "Networking Event", "Training Session", "Keynote", "Town Hall", "Fireside Chat"];
  const disciplines: DisciplineName[] = ["Political Science", "Economics", "History", "Sociology", "Anthropology", "Psychology", "Human Geography", "Linguistics", "Archaeology", "Law", "Education", "Communication Studies", "Development Studies", "International Relations", "Criminology", "Demography", "Social Work", "Cultural Studies", "Philosophy"];
  const accessTypes: AccessName[] = ["Public", "Private", "Invitation Only"];
  const sortOptions: { key: SortBy; label: string }[] = [
    { key: 'startDate', label: 'Start Date' },
    { key: 'title', label: 'Title' },
    { key: 'createdAt', label: 'Created' }
  ];

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
                onPress={() => updateFilter('sortBy', option.key)}
              />
            ))}
          </View>
        </FilterSection>

        <FilterSection title="Sort Order">
          <View style={styles.buttonRow}>
            <FilterButton
              label="Ascending"
              isSelected={filters.sortOrder === 'asc'}
              onPress={() => updateFilter('sortOrder', 'asc')}
            />
            <FilterButton
              label="Descending"
              isSelected={filters.sortOrder === 'desc'}
              onPress={() => updateFilter('sortOrder', 'desc')}
            />
          </View>
        </FilterSection>

        <FilterSection title="Search">
          <TextInput
            placeholder="Search events..."
            placeholderTextColor={getColor('inputPlaceholder', mode)}
            value={filters.searchTerm}
            onChangeText={(text) => updateFilter('searchTerm', text)}
            style={[
              styles.searchInput,
              {
                backgroundColor: getColor('inputBackground', mode),
                borderColor: getColor('inputBorder', mode),
                color: getColor('inputText', mode),
              }
            ]}
          />
        </FilterSection>
        
        <FilterSection title="Format">
          <View style={styles.buttonRow}>
            {formats.map((format) => (
              <FilterButton
                key={format}
                label={format}
                isSelected={filters.format === format}
                onPress={() => updateFilter('format', filters.format === format ? null : format)}
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
                onPress={() => updateFilter('access', filters.access === access ? null : access)}
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

      {(filters.format || filters.disciplines.length > 0 || filters.access || filters.searchTerm) && (
        <View style={[styles.activeFiltersSection, { 
          backgroundColor: getColor('cardElevated', mode),
          borderColor: getColor('border', mode),
        }]}>
          <Text style={[styles.activeFiltersSectionTitle, { color: getColor('text', mode) }]}>
            Active Filters:
          </Text>
          <View style={styles.activeFiltersContainer}>
            {filters.format && (
              <Text style={[styles.activeFilterText, { color: getColor('text', mode) }]}>
                Format: {filters.format}
              </Text>
            )}
            {filters.disciplines.length > 0 && (
              <Text style={[styles.activeFilterText, { color: getColor('text', mode) }]}>
                Disciplines: {filters.disciplines.join(', ')}
              </Text>
            )}
            {filters.access && (
              <Text style={[styles.activeFilterText, { color: getColor('text', mode) }]}>
                Access: {filters.access}
              </Text>
            )}
            {filters.searchTerm && (
              <Text style={[styles.activeFilterText, { color: getColor('text', mode) }]}>
                Search: {filters.searchTerm}
              </Text>
            )}
          </View>
        </View>
      )}
      
      <TouchableOpacity
        onPress={resetFilters}
        style={[styles.resetButton, { backgroundColor: getColor('error', mode) }]}
      >
        <Text style={[styles.resetButtonText, { color: getColor('primaryText', mode) }]}>
          Reset All Filters
        </Text>
      </TouchableOpacity>
    </VStack>
  );
};

const styles = StyleSheet.create({
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
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  // MERGED the two redundant styles into one 'buttonRow' style
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // Negative margin technique for even spacing
    margin: -4,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4, // Child margin to counteract parent's negative margin
  },
  // RENAMED for clarity
  formatButton: {
    minWidth: 80,
  },
  filterButtonText: {
    textAlign: 'center',
    fontSize: 14,
  },
  searchInput: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  activeFiltersSection: {
    marginTop: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  activeFiltersSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  activeFiltersContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    margin: -4,
  },
  activeFilter: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
  },
  activeFilterText: {
    fontSize: 12,
    fontWeight: '500',
  },
  resetButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
});