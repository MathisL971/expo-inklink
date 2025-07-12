import { ChevronDown, LucideIcon, X } from "lucide-react";
import { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../constants/Styles";
import { Spinner } from "./ui/spinner";

export type CustomPickerProps = {
  label: string;
  value: string;
  onSelect: (...event: any[]) => void;
  onBlur: () => void;
  options: any[];
  error?: string;
  Icon?: LucideIcon;
  colors: any;
  placeholder: string;
};

export default function CustomPicker({
  label,
  value,
  onSelect,
  onBlur,
  options,
  error,
  Icon,
  colors,
  placeholder,
  loading = false, // new prop
}: CustomPickerProps & { loading?: boolean }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View style={[styles.inputContainer, { marginBottom: 16 }]}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <TouchableOpacity
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.inputBackground,
            borderColor: error ? colors.inputBorderError : colors.inputBorder,
            shadowColor: colors.shadow,
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
        <Text
          style={[
            styles.pickerText,
            {
              color: value ? colors.text : colors.inputPlaceholder,
              flex: 1,
            },
          ]}
        >
          {value || placeholder}
        </Text>
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
              {loading ? (
                <View style={{ alignItems: "center", padding: 24 }}>
                  <Spinner size="large" color={colors.primary} />
                </View>
              ) : (
                options.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionItem,
                      { borderBottomColor: colors.cardBorder },
                      value === option && {
                        backgroundColor: colors.primaryLight,
                      },
                    ]}
                    onPress={() => {
                      onSelect(option);
                      setIsVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color: value === option ? colors.primary : colors.text,
                        },
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
