// Improved Color Palette with Enhanced Consistency and Accessibility
// Uses a more systematic approach with proper contrast ratios and semantic naming

// Color scale type for consistent color palettes
type ColorScale = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
};

// Status color configuration
type StatusColor = {
  light: string;
  lightBg: string;
  dark: string;
  darkBg: string;
};

// Theme color structure
type ThemeColors = {
  // Core text and background
  text: string;
  textSecondary: string;
  textTertiary: string;
  background: string;
  backgroundElevated: string;

  // Primary brand colors
  primary: string;
  primaryHover: string;
  primaryActive: string;
  primaryText: string;
  primaryLight: string;
  primaryLighter: string;

  // Secondary colors
  secondary: string;
  secondaryHover: string;
  secondaryActive: string;
  secondaryText: string;
  secondaryLight: string;

  // Accent colors
  accent: string;
  accentHover: string;
  accentText: string;

  // Interactive elements
  tint: string;
  icon: string;
  iconHover: string;
  tabIconDefault: string;
  tabIconSelected: string;

  // Buttons
  buttonPrimary: string;
  buttonPrimaryHover: string;
  buttonPrimaryText: string;
  buttonSecondary: string;
  buttonSecondaryHover: string;
  buttonSecondaryText: string;
  buttonGhost: string;
  buttonGhostHover: string;
  buttonGhostText: string;

  // Cards and surfaces
  card: string;
  cardElevated: string;
  cardBorder: string;
  surface: string;
  surfaceElevated: string;

  // Borders and dividers
  border: string;
  borderLight: string;
  borderStrong: string;
  divider: string;

  // Form elements
  inputBackground: string;
  inputBackgroundFocus: string;
  inputBorder: string;
  inputBorderFocus: string;
  inputBorderError: string;
  inputText: string;
  inputPlaceholder: string;

  // Status colors
  success: string;
  successBg: string;
  successBorder: string;
  warning: string;
  warningBg: string;
  warningBorder: string;
  error: string;
  errorBg: string;
  errorBorder: string;
  info: string;
  infoBg: string;
  infoBorder: string;

  // Navigation
  navbarBackground: string;
  navbarBackgroundBlur: string;
  navbarBorder: string;
  navbarText: string;
  navbarTextActive: string;

  // Shadows and overlays
  shadow: string;
  shadowMedium: string;
  shadowLarge: string;
  overlay: string;
  backdrop: string;
};

// Main color configuration type
type ColorConfig = {
  light: ThemeColors;
  dark: ThemeColors;
};

// Base lime colors - using a more refined lime palette
const lime: ColorScale = {
  50: "rgba(247, 254, 231, 1)", // Very light lime
  100: "rgba(236, 252, 203, 1)", // Light lime
  200: "rgba(217, 249, 157, 1)", // Lighter lime
  300: "rgba(190, 242, 100, 1)", // Medium-light lime
  400: "rgba(163, 230, 53, 1)", // Medium lime
  500: "rgba(132, 204, 22, 1)", // Primary lime
  600: "rgba(101, 163, 13, 1)", // Darker lime
  700: "rgba(77, 124, 15, 1)", // Dark lime
  800: "rgba(54, 83, 20, 1)", // Very dark lime
  900: "rgba(26, 46, 5, 1)", // Deepest lime
  950: "rgba(13, 19, 3, 1)", // Deepest lime
};

// Neutral grays with better progression
const neutral: ColorScale = {
  50: "rgba(248, 250, 252, 1)", // Almost white
  100: "rgba(241, 245, 249, 1)", // Very light gray
  200: "rgba(226, 232, 240, 1)", // Light gray
  300: "rgba(203, 213, 225, 1)", // Medium-light gray
  400: "rgba(148, 163, 184, 1)", // Medium gray
  500: "rgba(100, 116, 139, 1)", // Balanced gray
  600: "rgba(71, 85, 105, 1)", // Medium-dark gray
  700: "rgba(51, 65, 85, 1)", // Dark gray
  800: "rgba(30, 41, 59, 1)", // Very dark gray
  900: "rgba(15, 23, 42, 1)", // Almost black
  950: "rgba(2, 6, 23, 1)", // Deepest dark
};

// Status colors with improved accessibility
const status: Record<"success" | "warning" | "error" | "info", StatusColor> = {
  success: {
    light: "rgba(34, 197, 94, 1)",
    lightBg: "rgba(240, 253, 244, 1)",
    dark: "rgba(74, 222, 128, 1)",
    darkBg: "rgba(20, 83, 45, 1)",
  },
  warning: {
    light: "rgba(245, 158, 11, 1)",
    lightBg: "rgba(255, 251, 235, 1)",
    dark: "rgba(251, 191, 36, 1)",
    darkBg: "rgba(92, 50, 0, 1)",
  },
  error: {
    light: "rgba(239, 68, 68, 1)",
    lightBg: "rgba(254, 242, 242, 1)",
    dark: "rgba(248, 113, 113, 1)",
    darkBg: "rgba(87, 13, 13, 1)",
  },
  info: {
    light: "rgba(59, 130, 246, 1)",
    lightBg: "rgba(239, 246, 255, 1)",
    dark: "rgba(96, 165, 250, 1)",
    darkBg: "rgba(23, 37, 84, 1)",
  },
};

export const Colors: ColorConfig = {
  light: {
    // Core text and background
    text: neutral[900],
    textSecondary: neutral[600],
    textTertiary: neutral[500],
    background: "rgba(255, 255, 255, 1)",
    backgroundElevated: neutral[50],

    // Primary brand colors
    primary: lime[500],
    primaryHover: lime[600],
    primaryActive: lime[700],
    primaryText: "rgba(255, 255, 255, 1)",
    primaryLight: lime[100],
    primaryLighter: lime[50],

    // Secondary colors
    secondary: neutral[500],
    secondaryHover: neutral[600],
    secondaryActive: neutral[700],
    secondaryText: "rgba(255, 255, 255, 1)",
    secondaryLight: neutral[100],

    // Accent colors
    accent: "rgba(99, 102, 241, 1)", // Indigo for better contrast
    accentHover: "rgba(79, 70, 229, 1)",
    accentText: "rgba(255, 255, 255, 1)",

    // Interactive elements
    tint: lime[500], // Legacy support
    icon: neutral[500],
    iconHover: neutral[700],
    tabIconDefault: neutral[400],
    tabIconSelected: lime[500],

    // Buttons
    buttonPrimary: lime[500],
    buttonPrimaryHover: lime[600],
    buttonPrimaryText: "rgba(255, 255, 255, 1)",
    buttonSecondary: neutral[100],
    buttonSecondaryHover: neutral[200],
    buttonSecondaryText: neutral[700],
    buttonGhost: "transparent",
    buttonGhostHover: neutral[100],
    buttonGhostText: neutral[700],

    // Cards and surfaces
    card: "rgba(255, 255, 255, 1)",
    cardElevated: neutral[50],
    cardBorder: neutral[200],
    surface: "rgba(255, 255, 255, 1)",
    surfaceElevated: neutral[50],

    // Borders and dividers
    border: neutral[200],
    borderLight: neutral[100],
    borderStrong: neutral[300],
    divider: neutral[200],

    // Form elements
    inputBackground: "rgba(255, 255, 255, 1)",
    inputBackgroundFocus: "rgba(255, 255, 255, 1)",
    inputBorder: neutral[300],
    inputBorderFocus: lime[500],
    inputBorderError: status.error.light,
    inputText: neutral[900],
    inputPlaceholder: neutral[400],

    // Status colors
    success: status.success.light,
    successBg: status.success.lightBg,
    successBorder: "rgba(34, 197, 94, 0.2)",

    warning: status.warning.light,
    warningBg: status.warning.lightBg,
    warningBorder: "rgba(245, 158, 11, 0.2)",

    error: status.error.light,
    errorBg: status.error.lightBg,
    errorBorder: "rgba(239, 68, 68, 0.2)",

    info: status.info.light,
    infoBg: status.info.lightBg,
    infoBorder: "rgba(59, 130, 246, 0.2)",

    // Navigation
    navbarBackground: "rgba(255, 255, 255, 0.95)",
    navbarBackgroundBlur: "rgba(255, 255, 255, 0.8)",
    navbarBorder: "rgba(226, 232, 240, 0.8)",
    navbarText: neutral[700],
    navbarTextActive: lime[600],

    // Shadows and overlays
    shadow: "rgba(0, 0, 0, 0.08)",
    shadowMedium: "rgba(0, 0, 0, 0.12)",
    shadowLarge: "rgba(0, 0, 0, 0.16)",
    overlay: "rgba(0, 0, 0, 0.4)",
    backdrop: "rgba(0, 0, 0, 0.2)",
  },

  dark: {
    // Core text and background
    text: neutral[50],
    textSecondary: neutral[300],
    textTertiary: neutral[400],
    background: neutral[950],
    backgroundElevated: neutral[900],

    // Primary brand colors
    primary: lime[400], // Brighter for dark theme
    primaryHover: lime[300],
    primaryActive: lime[200],
    primaryText: neutral[900],
    primaryLight: lime[900],
    primaryLighter: lime[800],

    // Secondary colors
    secondary: neutral[400],
    secondaryHover: neutral[300],
    secondaryActive: neutral[200],
    secondaryText: neutral[900],
    secondaryLight: neutral[800],

    // Accent colors
    accent: "rgba(129, 140, 248, 1)", // Lighter indigo for dark theme
    accentHover: "rgba(165, 180, 252, 1)",
    accentText: neutral[900],

    // Interactive elements
    tint: lime[400], // Legacy support
    icon: neutral[400],
    iconHover: neutral[200],
    tabIconDefault: neutral[500],
    tabIconSelected: lime[400],

    // Buttons
    buttonPrimary: lime[400],
    buttonPrimaryHover: lime[300],
    buttonPrimaryText: neutral[900],
    buttonSecondary: neutral[800],
    buttonSecondaryHover: neutral[700],
    buttonSecondaryText: neutral[200],
    buttonGhost: "transparent",
    buttonGhostHover: neutral[800],
    buttonGhostText: neutral[300],

    // Cards and surfaces
    card: neutral[900],
    cardElevated: neutral[800],
    cardBorder: neutral[700],
    surface: neutral[900],
    surfaceElevated: neutral[800],

    // Borders and dividers
    border: neutral[700],
    borderLight: neutral[800],
    borderStrong: neutral[600],
    divider: neutral[700],

    // Form elements
    inputBackground: neutral[900],
    inputBackgroundFocus: neutral[800],
    inputBorder: neutral[600],
    inputBorderFocus: lime[400],
    inputBorderError: status.error.dark,
    inputText: neutral[50],
    inputPlaceholder: neutral[500],

    // Status colors
    success: status.success.dark,
    successBg: status.success.darkBg,
    successBorder: "rgba(74, 222, 128, 0.2)",

    warning: status.warning.dark,
    warningBg: status.warning.darkBg,
    warningBorder: "rgba(251, 191, 36, 0.2)",

    error: status.error.dark,
    errorBg: status.error.darkBg,
    errorBorder: "rgba(248, 113, 113, 0.2)",

    info: status.info.dark,
    infoBg: status.info.darkBg,
    infoBorder: "rgba(96, 165, 250, 0.2)",

    // Navigation
    navbarBackground: "rgba(2, 6, 23, 0.95)",
    navbarBackgroundBlur: "rgba(2, 6, 23, 0.8)",
    navbarBorder: "rgba(51, 65, 85, 0.8)",
    navbarText: neutral[300],
    navbarTextActive: lime[400],

    // Shadows and overlays
    shadow: "rgba(0, 0, 0, 0.25)",
    shadowMedium: "rgba(0, 0, 0, 0.35)",
    shadowLarge: "rgba(0, 0, 0, 0.45)",
    overlay: "rgba(0, 0, 0, 0.6)",
    backdrop: "rgba(0, 0, 0, 0.4)",
  },
};

// Utility function to get color with opacity
export const withOpacity = (color: string, opacity: number): string => {
  return color.replace(/rgba?\(([^)]+)\)/, `rgba($1, ${opacity})`);
};

// Theme type for the getColor function
type Theme = "light" | "dark";

// Utility function to get theme-aware color
export const getColor = (
  colorKey: keyof ThemeColors,
  theme: Theme = "light"
): string => {
  const keys = colorKey.split(".");
  let color: any = Colors[theme];

  for (const key of keys) {
    if (color && typeof color === "object" && key in color) {
      color = color[key];
    }
  }

  return typeof color === "string" ? color : "";
};

// Color palette for design reference
export const palette = {
  lime,
  neutral,
  status,
} as const;

// Type exports for external use
export type { ColorConfig, ColorScale, StatusColor, Theme, ThemeColors };
