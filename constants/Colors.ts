// Previously:
// const tintColorLight = '#2f95dc';
// const tintColorDark = '#fff';

// Updated with Tailwind Lime shades (RGBA format)
const tintColorLight = 'rgba(132, 204, 22, 1)'; // Tailwind Lime 500 - For light theme
const tintColorDark = 'rgba(163, 230, 53, 1)';  // Tailwind Lime 400 - For dark theme (brighter for dark backgrounds)

export const Colors = {
  light: {
    text: 'rgba(17, 24, 28, 1)',
    background: 'rgba(255, 255, 255, 1)',
    tint: tintColorLight,
    icon: 'rgba(104, 112, 118, 1)',
    tabIconDefault: 'rgba(104, 112, 118, 1)',
    tabIconSelected: tintColorLight,
    buttonBackground: 'rgba(101, 163, 13, 1)', // Tailwind Lime 600 - A slightly deeper lime for buttons
    buttonText: 'rgba(255, 255, 255, 1)', // White text for good contrast on Lime 600
    
    // Extended colors for more UI elements
    card: 'rgba(255, 255, 255, 1)',
    cardText: 'rgba(17, 24, 28, 1)',
    border: 'rgba(226, 232, 240, 1)',
    inputBackground: 'rgba(248, 250, 252, 1)',
    inputBorder: 'rgba(203, 213, 225, 1)',
    inputText: 'rgba(17, 24, 28, 1)',
    placeholder: 'rgba(100, 116, 139, 1)',
    
    // Status colors
    success: 'rgba(34, 197, 94, 1)',
    successBackground: 'rgba(220, 252, 231, 1)',
    warning: 'rgba(245, 158, 11, 1)',
    warningBackground: 'rgba(254, 243, 199, 1)',
    error: 'rgba(239, 68, 68, 1)',
    errorBackground: 'rgba(254, 226, 226, 1)',
    info: 'rgba(59, 130, 246, 1)',
    infoBackground: 'rgba(219, 234, 254, 1)',
    
    // Additional lime variations
    limeLight: 'rgba(236, 252, 203, 1)', // Lime 100
    limeLighter: 'rgba(247, 254, 231, 1)', // Lime 50
    limeDark: 'rgba(77, 124, 15, 1)', // Lime 700
    limeDarker: 'rgba(54, 83, 20, 1)', // Lime 800
    
    // Semantic colors
    primary: tintColorLight,
    primaryText: 'rgba(255, 255, 255, 1)',
    secondary: 'rgba(100, 116, 139, 1)',
    secondaryText: 'rgba(255, 255, 255, 1)',
    accent: 'rgba(245, 158, 11, 1)',
    accentText: 'rgba(255, 255, 255, 1)',
    
    // Surface variations
    surface: 'rgba(255, 255, 255, 1)',
    surfaceVariant: 'rgba(248, 250, 252, 1)',
    outline: 'rgba(203, 213, 225, 1)',
    shadow: 'rgba(0, 0, 0, 0.1)',
    
    // Navigation
    navbarBackground: 'rgba(217, 249, 157, 1)',
    navbarBorder: 'rgba(226, 232, 240, 0.8)',
  },
  dark: {
    text: 'rgba(236, 237, 238, 1)',
    background: 'rgba(21, 23, 24, 1)',
    tint: tintColorDark,
    icon: 'rgba(155, 161, 166, 1)',
    tabIconDefault: 'rgba(155, 161, 166, 1)',
    tabIconSelected: tintColorDark,
    buttonBackground: 'rgba(132, 204, 22, 1)', // Tailwind Lime 500 - Matches the light theme's tint
    buttonText: 'rgba(21, 23, 24, 1)', // Dark background color for text
    
    // Extended colors for more UI elements
    card: 'rgba(30, 41, 59, 1)',
    cardText: 'rgba(236, 237, 238, 1)',
    border: 'rgba(51, 65, 85, 1)',
    inputBackground: 'rgba(30, 41, 59, 1)',
    inputBorder: 'rgba(71, 85, 105, 1)',
    inputText: 'rgba(236, 237, 238, 1)',
    placeholder: 'rgba(148, 163, 184, 1)',
    
    // Status colors (adjusted for dark theme)
    success: 'rgba(74, 222, 128, 1)',
    successBackground: 'rgba(20, 83, 45, 1)',
    warning: 'rgba(251, 191, 36, 1)',
    warningBackground: 'rgba(69, 26, 3, 1)',
    error: 'rgba(248, 113, 113, 1)',
    errorBackground: 'rgba(69, 10, 10, 1)',
    info: 'rgba(96, 165, 250, 1)',
    infoBackground: 'rgba(23, 37, 84, 1)',
    
    // Additional lime variations
    limeLight: 'rgba(190, 242, 100, 1)', // Lime 300 - brighter for dark theme
    limeLighter: 'rgba(217, 249, 157, 1)', // Lime 200 - even brighter
    limeDark: 'rgba(101, 163, 13, 1)', // Lime 600
    limeDarker: 'rgba(77, 124, 15, 1)', // Lime 700
    
    // Semantic colors
    primary: tintColorDark,
    primaryText: 'rgba(21, 23, 24, 1)',
    secondary: 'rgba(148, 163, 184, 1)',
    secondaryText: 'rgba(21, 23, 24, 1)',
    accent: 'rgba(251, 191, 36, 1)',
    accentText: 'rgba(21, 23, 24, 1)',
    
    // Surface variations
    surface: 'rgba(30, 41, 59, 1)',
    surfaceVariant: 'rgba(51, 65, 85, 1)',
    outline: 'rgba(71, 85, 105, 1)',
    shadow: 'rgba(0, 0, 0, 0.3)',
    
    // Navigation
    navbarBackground: 'rgba(21, 23, 24, 0.95)',
    navbarBorder: 'rgba(51, 65, 85, 0.8)',
  },
};

// Utility functions for easier color access
export const getColor = (colorName: keyof typeof Colors.light, theme: 'light' | 'dark' = 'light') => {
  return Colors[theme][colorName];
};

export const getLimeShade = (shade: 'lighter' | 'light' | 'normal' | 'dark' | 'darker', theme: 'light' | 'dark' = 'light') => {
  const shadeMap = {
    lighter: theme === 'light' ? Colors.light.limeLighter : Colors.dark.limeLighter,
    light: theme === 'light' ? Colors.light.limeLight : Colors.dark.limeLight,
    normal: theme === 'light' ? Colors.light.tint : Colors.dark.tint,
    dark: theme === 'light' ? Colors.light.limeDark : Colors.dark.limeDark,
    darker: theme === 'light' ? Colors.light.limeDarker : Colors.dark.limeDarker,
  };
  return shadeMap[shade];
};

// CSS custom properties generator for web usage
export const generateCSSVariables = (theme: 'light' | 'dark') => {
  const colors = Colors[theme];
  const cssVars: Record<string, string> = {};
  
  Object.entries(colors).forEach(([key, value]) => {
    const cssVarName = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    cssVars[cssVarName] = value;
  });
  
  return cssVars;
};