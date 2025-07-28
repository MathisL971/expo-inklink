import ColorSchemeToggleButton from "@/components/ColorSchemeToggleButton";
import { HapticTab } from "@/components/HapticTab";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

export default function TabLayout() {
  const { mode } = useColorScheme();
  const navbarBackgroundColor = Colors[mode ?? "light"].navbarBackground;

  return (
    <Tabs
      screenOptions={{
        headerShown: Platform.OS !== "web",
        title: "Soscitea",
        tabBarActiveTintColor: Colors[mode ?? "light"].tint,
        tabBarInactiveTintColor: Colors[mode ?? "light"].text,
        tabBarButton: HapticTab,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            backgroundColor: navbarBackgroundColor,
            borderTopColor: navbarBackgroundColor,
            opacity: 1,
          },
          default: {
            backgroundColor: navbarBackgroundColor,
            borderTopColor: navbarBackgroundColor,
            opacity: 1,
          },
        }),
        headerRight: () => <ColorSchemeToggleButton />,
        headerStyle: {
          backgroundColor: navbarBackgroundColor,
        },
        headerTitleStyle: {
          color: Colors[mode ?? "light"].text,
        },
      }}
    >
      <Tabs.Screen
        name="tickets/index"
        options={{
          title: "Tickets",
          tabBarStyle: {
            display: Platform.OS !== "web" ? "flex" : "none",
            backgroundColor: navbarBackgroundColor,
            borderTopColor: navbarBackgroundColor,
            opacity: 1,
          },
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Explore",
          tabBarStyle: {
            display: Platform.OS !== "web" ? "flex" : "none",
            backgroundColor: navbarBackgroundColor,
            borderTopColor: navbarBackgroundColor,
            opacity: 1,
          },
        }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{
          title: "Settings",
          tabBarStyle: {
            display: Platform.OS !== "web" ? "flex" : "none",
            backgroundColor: navbarBackgroundColor,
            borderTopColor: navbarBackgroundColor,
            opacity: 1,
          },
        }}
      />
    </Tabs>
  );
}
