import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import ColorSchemeToggleButton from "@/components/ColorSchemeToggleButton";
import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/contexts/ColorSchemeContext";

export default function TabLayout({ children }: { children: React.ReactNode }) {
  const { mode } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: Platform.OS !== "web",
        title: "Inklink",
        tabBarActiveTintColor: Colors[mode ?? "light"].tint,
        tabBarInactiveTintColor: Colors[mode ?? "light"].text,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
        headerRight: () => <ColorSchemeToggleButton />,
        headerStyle: {
          backgroundColor: Colors[mode ?? "light"].navbarBackground,
        },
        headerTitleStyle: {
          color: Colors[mode ?? "light"].text,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarStyle: {
            display: Platform.OS !== "web" ? "flex" : "none",
            backgroundColor: Colors[mode ?? "light"].navbarBackground,
            borderTopColor: Colors[mode ?? "light"].navbarBackground,
          },
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarStyle: {
            display: Platform.OS !== "web" ? "flex" : "none",
            backgroundColor: Colors[mode ?? "light"].navbarBackground,
            borderTopColor: Colors[mode ?? "light"].navbarBackground,
          },
        }}
      />
    </Tabs>
  );
}
