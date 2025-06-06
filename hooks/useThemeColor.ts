/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/contexts/ColorSchemeContext";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const { mode } = useColorScheme();

  // No need for fallback since MMKV ensures mode is always available immediately
  const colorFromProps = props[mode];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[mode][colorName];
  }
}
