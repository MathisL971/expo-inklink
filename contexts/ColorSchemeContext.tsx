import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export type ModeType = "light" | "dark";

const THEME_STORAGE_KEY = "@app_theme_mode";

// Cache the theme in memory for immediate subsequent access
let cachedTheme: ModeType | null = null;

const ColorSchemeContext = createContext<{
  mode: ModeType;
  setMode: (mode: ModeType) => void;
  isLoading: boolean;
}>({
  mode: "light",
  setMode: () => {},
  isLoading: true,
});

export const ColorSchemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Use cached theme immediately if available
  const [mode, setMode] = useState<ModeType>(cachedTheme || "light");
  const [isLoading, setIsLoading] = useState(!cachedTheme);

  // Load theme from AsyncStorage only on first app launch
  useEffect(() => {
    if (cachedTheme) return; // Skip if we already have it cached

    const loadTheme = async () => {
      try {
        const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        const themeToUse =
          savedMode === "light" || savedMode === "dark" ? savedMode : "light";

        cachedTheme = themeToUse;
        setMode(themeToUse);
      } catch (error) {
        console.error("Failed to load theme from storage:", error);
        cachedTheme = "light";
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  // Update theme with immediate cache update
  const updateMode = async (newMode: ModeType) => {
    try {
      // Update cache immediately for instant UI updates
      cachedTheme = newMode;
      setMode(newMode);

      // Save to storage in background
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
    } catch (error) {
      console.error("Failed to save theme to storage:", error);
    }
  };

  return (
    <ColorSchemeContext.Provider
      value={{ mode, setMode: updateMode, isLoading }}
    >
      {children}
    </ColorSchemeContext.Provider>
  );
};

export const useColorScheme = () => useContext(ColorSchemeContext);
