import { LucideIcon } from "lucide-react";
import { KeyboardTypeOptions, Text, TextInput, View } from "react-native";
import { styles } from "../constants/Styles";

export type CustomInputProps = {
  label: string;
  value: string;
  onBlur: () => void;
  onChangeText: (value: string) => void;
  placeholder: string;
  error?: string;
  multiline?: boolean;
  Icon?: LucideIcon;
  colors: any;
  keyboardType?: KeyboardTypeOptions;
};

export default function CustomInput({
  value,
  onBlur,
  onChangeText,
  label,
  placeholder,
  error,
  colors,
  Icon,
  multiline,
  ...props
}: CustomInputProps) {
  return (
    <View style={[styles.inputContainer, { marginBottom: 16 }]}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.inputBackground,
            borderColor: error ? colors.inputBorderError : colors.inputBorder,
            shadowColor: colors.shadow,
          },
        ]}
      >
        {Icon && (
          <Icon
            size={20}
            color={colors.textSecondary}
            style={styles.inputIcon}
          />
        )}
        <TextInput
          style={[
            styles.textInput,
            {
              color: colors.text,
              height: multiline ? 80 : 44,
              textAlignVertical: multiline ? "top" : "center",
            },
          ]}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor={colors.inputPlaceholder}
          multiline={multiline}
          {...props}
        />
      </View>
      {error && (
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      )}
    </View>
  );
}
