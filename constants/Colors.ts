// Academic Color Palette for Social Sciences Ticketing Platform
// Designed to convey trust, intellect, and professionalism while maintaining accessibility

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

  // Primary brand colors - Deep Academic Blue
  primary: string;
  primaryHover: string;
  primaryActive: string;
  primaryText: string;
  primaryLight: string;
  primaryLighter: string;

  // Secondary colors - Warm Gray for balance
  secondary: string;
  secondaryHover: string;
  secondaryActive: string;
  secondaryText: string;
  secondaryLight: string;

  // Accent colors - Scholarly Gold
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

// Deep Academic Blue - Primary color representing trust, knowledge, and professionalism
const academicBlue: ColorScale = {
  50: "rgba(240, 249, 255, 1)", // Very light blue
  100: "rgba(224, 242, 254, 1)", // Light blue
  200: "rgba(186, 230, 253, 1)", // Lighter blue
  300: "rgba(125, 211, 252, 1)", // Medium-light blue
  400: "rgba(56, 189, 248, 1)", // Medium blue
  500: "rgba(14, 165, 233, 1)", // Primary academic blue
  600: "rgba(2, 132, 199, 1)", // Darker blue
  700: "rgba(3, 105, 161, 1)", // Dark blue
  800: "rgba(7, 89, 133, 1)", // Very dark blue
  900: "rgba(12, 74, 110, 1)", // Deep blue
  950: "rgba(8, 47, 73, 1)", // Deepest blue
};

// Warm Gray - Better for academic contexts than cold neutrals
const warmGray: ColorScale = {
  50: "rgba(250, 250, 249, 1)", // Warm white
  100: "rgba(245, 245, 244, 1)", // Very light warm gray
  200: "rgba(231, 229, 228, 1)", // Light warm gray
  300: "rgba(214, 211, 209, 1)", // Medium-light warm gray
  400: "rgba(168, 162, 158, 1)", // Medium warm gray
  500: "rgba(120, 113, 108, 1)", // Balanced warm gray
  600: "rgba(87, 83, 78, 1)", // Medium-dark warm gray
  700: "rgba(68, 64, 60, 1)", // Dark warm gray
  800: "rgba(41, 37, 36, 1)", // Very dark warm gray
  900: "rgba(28, 25, 23, 1)", // Almost black warm
  950: "rgba(12, 10, 9, 1)", // Deepest warm
};

// Scholarly Gold - Accent color representing achievement and prestige
const scholarlyGold: ColorScale = {
  50: "rgba(255, 251, 235, 1)", // Very light gold
  100: "rgba(254, 243, 199, 1)", // Light gold
  200: "rgba(253, 230, 138, 1)", // Lighter gold
  300: "rgba(252, 211, 77, 1)", // Medium-light gold
  400: "rgba(251, 191, 36, 1)", // Medium gold
  500: "rgba(245, 158, 11, 1)", // Primary scholarly gold
  600: "rgba(217, 119, 6, 1)", // Darker gold
  700: "rgba(180, 83, 9, 1)", // Dark gold
  800: "rgba(146, 64, 14, 1)", // Very dark gold
  900: "rgba(120, 53, 15, 1)", // Deep gold
  950: "rgba(69, 26, 3, 1)", // Deepest gold
};

// Status colors refined for academic context
const status: Record<"success" | "warning" | "error" | "info", StatusColor> = {
  success: {
    light: "rgba(34, 197, 94, 1)", // Green for confirmations
    lightBg: "rgba(240, 253, 244, 1)",
    dark: "rgba(74, 222, 128, 1)",
    darkBg: "rgba(20, 83, 45, 1)",
  },
  warning: {
    light: "rgba(245, 158, 11, 1)", // Scholarly gold for warnings
    lightBg: "rgba(255, 251, 235, 1)",
    dark: "rgba(251, 191, 36, 1)",
    darkBg: "rgba(92, 50, 0, 1)",
  },
  error: {
    light: "rgba(220, 38, 38, 1)", // Professional red
    lightBg: "rgba(254, 242, 242, 1)",
    dark: "rgba(248, 113, 113, 1)",
    darkBg: "rgba(87, 13, 13, 1)",
  },
  info: {
    light: "rgba(14, 165, 233, 1)", // Academic blue for info
    lightBg: "rgba(240, 249, 255, 1)",
    dark: "rgba(56, 189, 248, 1)",
    darkBg: "rgba(8, 47, 73, 1)",
  },
};

export const Colors: ColorConfig = {
  light: {
    // Core text and background
    text: warmGray[900],
    textSecondary: warmGray[600],
    textTertiary: warmGray[500],
    background: "rgba(255, 255, 255, 1)",
    backgroundElevated: warmGray[50], // Already distinct

    // Primary brand colors - Academic Blue
    primary: academicBlue[600],
    primaryHover: academicBlue[700],
    primaryActive: academicBlue[800],
    primaryText: "rgba(255, 255, 255, 1)",
    primaryLight: academicBlue[100],
    primaryLighter: academicBlue[50],

    // Secondary colors - Warm Gray
    secondary: warmGray[500],
    secondaryHover: warmGray[600],
    secondaryActive: warmGray[700],
    secondaryText: "rgba(255, 255, 255, 1)",
    secondaryLight: warmGray[100],

    // Accent colors - Scholarly Gold
    accent: scholarlyGold[500],
    accentHover: scholarlyGold[600],
    accentText: "rgba(255, 255, 255, 1)",

    // Interactive elements
    tint: academicBlue[600],
    icon: warmGray[500],
    iconHover: academicBlue[600],
    tabIconDefault: warmGray[400],
    tabIconSelected: academicBlue[600],

    // Buttons
    buttonPrimary: academicBlue[600],
    buttonPrimaryHover: academicBlue[700],
    buttonPrimaryText: "rgba(255, 255, 255, 1)",
    buttonSecondary: warmGray[100],
    buttonSecondaryHover: warmGray[200],
    buttonSecondaryText: warmGray[700],
    buttonGhost: "transparent",
    buttonGhostHover: warmGray[100],
    buttonGhostText: warmGray[700],

    // Cards and surfaces
    card: warmGray[100], // Changed from "rgba(255, 255, 255, 1)"
    cardElevated: warmGray[50], // Keep as is, or consider warmGray[100] if you need a deeper hierarchy
    cardBorder: warmGray[200], // Will help with definition too
    surface: "rgba(255, 255, 255, 1)", // Keep as is
    surfaceElevated: warmGray[50], // Keep as is

    // Borders and dividers
    border: warmGray[200],
    borderLight: warmGray[100],
    borderStrong: warmGray[300],
    divider: warmGray[200],

    // Form elements
    inputBackground: "rgba(255, 255, 255, 1)",
    inputBackgroundFocus: "rgba(255, 255, 255, 1)",
    inputBorder: warmGray[300],
    inputBorderFocus: academicBlue[500],
    inputBorderError: status.error.light,
    inputText: warmGray[900],
    inputPlaceholder: warmGray[400],

    // Status colors
    success: status.success.light,
    successBg: status.success.lightBg,
    successBorder: "rgba(34, 197, 94, 0.2)",

    warning: status.warning.light,
    warningBg: status.warning.lightBg,
    warningBorder: "rgba(245, 158, 11, 0.2)",

    error: status.error.light,
    errorBg: status.error.lightBg,
    errorBorder: "rgba(220, 38, 38, 0.2)",

    info: status.info.light,
    infoBg: status.info.lightBg,
    infoBorder: "rgba(14, 165, 233, 0.2)",

    // Navigation
    navbarBackground: "rgba(255, 255, 255, 0.95)",
    navbarBackgroundBlur: "rgba(255, 255, 255, 0.9)",
    navbarBorder: "rgba(231, 229, 228, 0.8)",
    navbarText: warmGray[700],
    navbarTextActive: academicBlue[600],

    // Shadows and overlays
    shadow: "rgba(0, 0, 0, 0.08)",
    shadowMedium: "rgba(0, 0, 0, 0.12)",
    shadowLarge: "rgba(0, 0, 0, 0.16)",
    overlay: "rgba(0, 0, 0, 0.4)",
    backdrop: "rgba(0, 0, 0, 0.2)",
  },

  dark: {
    // Core text and background
    text: warmGray[50],
    textSecondary: warmGray[300],
    textTertiary: warmGray[400],
    background: warmGray[950],
    backgroundElevated: warmGray[900],

    // Primary brand colors - Lighter Academic Blue for dark theme
    primary: academicBlue[400],
    primaryHover: academicBlue[300],
    primaryActive: academicBlue[200],
    primaryText: warmGray[900],
    primaryLight: academicBlue[900],
    primaryLighter: academicBlue[950],

    // Secondary colors
    secondary: warmGray[400],
    secondaryHover: warmGray[300],
    secondaryActive: warmGray[200],
    secondaryText: warmGray[900],
    secondaryLight: warmGray[800],

    // Accent colors - Brighter Gold for dark theme
    accent: scholarlyGold[400],
    accentHover: scholarlyGold[300],
    accentText: warmGray[900],

    // Interactive elements
    tint: academicBlue[400],
    icon: warmGray[400],
    iconHover: academicBlue[300],
    tabIconDefault: warmGray[500],
    tabIconSelected: academicBlue[400],

    // Buttons
    buttonPrimary: academicBlue[500],
    buttonPrimaryHover: academicBlue[400],
    buttonPrimaryText: "rgba(255, 255, 255, 1)",
    buttonSecondary: warmGray[800],
    buttonSecondaryHover: warmGray[700],
    buttonSecondaryText: warmGray[200],
    buttonGhost: "transparent",
    buttonGhostHover: warmGray[800],
    buttonGhostText: warmGray[300],

    // Cards and surfaces
    card: warmGray[900],
    cardElevated: warmGray[800],
    cardBorder: warmGray[700],
    surface: warmGray[900],
    surfaceElevated: warmGray[800],

    // Borders and dividers
    border: warmGray[700],
    borderLight: warmGray[800],
    borderStrong: warmGray[600],
    divider: warmGray[700],

    // Form elements
    inputBackground: warmGray[900],
    inputBackgroundFocus: warmGray[800],
    inputBorder: warmGray[600],
    inputBorderFocus: academicBlue[400],
    inputBorderError: status.error.dark,
    inputText: warmGray[50],
    inputPlaceholder: warmGray[500],

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
    infoBorder: "rgba(56, 189, 248, 0.2)",

    // Navigation
    navbarBackground: warmGray[900], // Changed from warmGray[950]
    navbarBackgroundBlur: "rgba(12, 10, 9, 0.9)", // Keep current or adjust based on new background
    navbarBorder: "rgba(68, 64, 60, 0.8)",
    navbarText: warmGray[300],
    navbarTextActive: academicBlue[400],

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
  academicBlue,
  warmGray,
  scholarlyGold,
  status,
} as const;

// Semantic color helpers for specific use cases
export const semanticColors = {
  // Event categories
  lecture: academicBlue[600],
  conference: scholarlyGold[600],
  seminar: warmGray[600],
  workshop: academicBlue[500],

  // Ticket status
  available: status.success.light,
  limited: status.warning.light,
  soldOut: status.error.light,

  // Academic disciplines (optional extensions)
  psychology: "rgba(139, 69, 19, 1)", // Warm brown
  sociology: "rgba(75, 0, 130, 1)", // Indigo
  economics: "rgba(0, 100, 0, 1)", // Dark green
  philosophy: "rgba(72, 61, 139, 1)", // Dark slate blue
  anthropology: "rgba(205, 92, 92, 1)", // Indian red
} as const;

// Type exports for external use
export type { ColorConfig, ColorScale, StatusColor, Theme, ThemeColors };

