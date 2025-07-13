import { ChevronDown, LucideIcon, X } from "lucide-react";
import { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../constants/Styles";

export type MultiSelectProps = {
  label: string;
  values: string[];
  onSelect: (...event: any[]) => void;
  onBlur: () => void;
  options: string[];
  error?: string;
  Icon: LucideIcon;
  colors: any;
  placeholder: string;
};

export default function CustomMultiSelect({
  label,
  error,
  Icon,
  onSelect,
  onBlur,
  values,
  options,
  placeholder,
  colors,
}: MultiSelectProps) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleOption = (option: string) => {
    if (values.includes(option)) {
      onSelect(values.filter((v) => v !== option));
    } else {
      onSelect([...values, option]);
    }
  };

  return (
    <View style={[styles.inputContainer]}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <TouchableOpacity
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.inputBackground,
            borderColor: error ? colors.inputBorderError : colors.inputBorder,
            shadowColor: colors.shadow,
            minHeight: 44,
          },
        ]}
        onPress={() => setIsVisible(true)}
        onBlur={onBlur}
      >
        {Icon && (
          <Icon
            size={20}
            color={colors.textSecondary}
            style={styles.inputIcon}
          />
        )}
        <View style={styles.selectedItemsContainer}>
          {values.length === 0 ? (
            <Text
              style={[styles.pickerText, { color: colors.inputPlaceholder }]}
            >
              {placeholder}
            </Text>
          ) : (
            <View style={styles.tagsContainer}>
              {values.map((value) => (
                <View
                  key={value}
                  style={[styles.tag, { backgroundColor: colors.primaryLight }]}
                >
                  <Text style={[styles.tagText, { color: colors.primary }]}>
                    {value}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
        <ChevronDown size={20} color={colors.textSecondary} />
      </TouchableOpacity>
      {error && (
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      )}

      <Modal visible={isVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
            ]}
          >
            <View
              style={[
                styles.modalHeader,
                { borderBottomColor: colors.cardBorder },
              ]}
            >
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {label}
              </Text>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <X size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.optionsList}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionItem,
                    { borderBottomColor: colors.cardBorder },
                    values.includes(option) && {
                      backgroundColor: colors.primaryLight,
                    },
                  ]}
                  onPress={() => toggleOption(option)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color: values.includes(option)
                          ? colors.primary
                          : colors.text,
                      },
                    ]}
                  >
                    {option}
                  </Text>
                  {values.includes(option) && (
                    <View
                      style={[
                        styles.checkmark,
                        { backgroundColor: colors.primary },
                      ]}
                    >
                      <Text
                        style={[
                          styles.checkmarkText,
                          { color: colors.primaryText },
                        ]}
                      >
                        ✓
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
