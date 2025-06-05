// At the top of your not-found.tsx
import Container from "@/components/Container";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { Colors, palette } from "@/constants/Colors"; // Adjust this path to your Colors.ts file
import { useColorScheme } from "@/contexts/ColorSchemeContext"; // <<<<====== ADJUST THIS PATH
import { LinearGradient } from "expo-linear-gradient"; // Or 'react-native-linear-gradient'
import { router } from "expo-router";
import { useEffect, useMemo, useRef } from "react"; // Added useMemo
import { Animated, StyleSheet, Text } from "react-native";

export default function NotFoundScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  // Get the current theme mode
  const { mode } = useColorScheme(); // Example: { mode: 'light' } or { mode: 'dark' }
  const currentThemeColors = mode === "dark" ? Colors.dark : Colors.light;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous bounce animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim, scaleAnim, bounceAnim]);

  // Memoize dynamic styles that depend on the theme to prevent re-computation on every render
  const dynamicStyles = useMemo(
    () => ({
      containerBackground:
        mode === "dark"
          ? [palette.academicBlue[950], palette.warmGray[900]] // Dark theme gradient
          : [palette.academicBlue[50], palette.warmGray[50]], // Light theme gradient
      text404: { color: currentThemeColors.primary },
      titleText: { color: currentThemeColors.text },
      subtitleText: { color: currentThemeColors.textSecondary },
      planet: {
        backgroundColor: currentThemeColors.primary,
        shadowColor:
          mode === "dark"
            ? palette.academicBlue[700]
            : palette.academicBlue[800],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: mode === "dark" ? 0.4 : 0.3,
        shadowRadius: 5,
        elevation: 8,
      },
      orbitalRing1: {
        borderColor:
          mode === "dark"
            ? palette.academicBlue[500]
            : palette.academicBlue[300],
        borderStyle: "dashed",
      },
      orbitalRing2: {
        borderColor:
          mode === "dark" ? palette.warmGray[500] : palette.warmGray[300],
        borderStyle: "dotted",
      },
      floatingGold: { backgroundColor: currentThemeColors.accent },
      floatingPrimaryLight: {
        backgroundColor:
          mode === "dark"
            ? palette.academicBlue[300]
            : palette.academicBlue[100],
      },
      floatingSecondaryLight: {
        backgroundColor:
          mode === "dark" ? palette.warmGray[400] : palette.warmGray[200],
      },
      primaryButton: { backgroundColor: currentThemeColors.buttonPrimary },
      primaryButtonText: { color: currentThemeColors.buttonPrimaryText },
      secondaryButton: {
        borderColor: currentThemeColors.border,
        borderWidth: 2,
      },
      secondaryButtonText: { color: currentThemeColors.buttonSecondaryText },
      footerText: { color: currentThemeColors.textTertiary },
    }),
    [mode, currentThemeColors]
  );

  return (
    <Container style={{ flex: 1 }}>
      <LinearGradient
        colors={[
          dynamicStyles.containerBackground[0],
          dynamicStyles.containerBackground[1],
        ]}
        style={StyleSheet.absoluteFill}
      />
      <Box style={styles.centeredContent}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
            alignItems: "center",
          }}
        >
          <VStack
            space="xl"
            className="items-center px-6 py-12 max-w-md mx-auto"
          >
            <Text
              className="text-8xl md:text-9xl font-black text-center"
              style={dynamicStyles.text404}
            >
              404
            </Text>

            <VStack space="md" className="items-center">
              <Text
                className="text-3xl md:text-4xl font-bold text-center mb-2"
                style={dynamicStyles.titleText}
              >
                Oops! Lost in the Syllabus
              </Text>
              <Text
                className="text-lg text-center leading-relaxed px-4"
                style={dynamicStyles.subtitleText}
              >
                {
                  "The page you're searching for seems to be on an unscheduled academic recess."
                }
              </Text>
            </VStack>

            <Animated.View
              style={{ transform: [{ translateY: bounceAnim }] }}
              className="my-8"
            >
              <Box className="relative items-center justify-center">
                <Box
                  className="w-32 h-32 rounded-full opacity-80 shadow-lg"
                  style={dynamicStyles.planet}
                />
                <Box
                  className="absolute w-40 h-12 border-2 rounded-full opacity-60"
                  style={{
                    borderColor:
                      mode === "dark"
                        ? palette.academicBlue[500]
                        : palette.academicBlue[300],
                  }}
                />
                <Box
                  className="absolute w-48 h-8 border rounded-full opacity-40"
                  style={{
                    borderColor:
                      mode === "dark"
                        ? palette.warmGray[500]
                        : palette.warmGray[300],
                  }}
                />
                <Box
                  className="absolute -top-6 -right-6 w-6 h-6 rounded-full opacity-70"
                  style={dynamicStyles.floatingGold}
                />
                <Box
                  className="absolute -bottom-4 -left-8 w-4 h-4 rounded-full opacity-60"
                  style={dynamicStyles.floatingPrimaryLight}
                />
                <Box
                  className="absolute top-4 -left-10 w-3 h-3 rounded-full opacity-50"
                  style={dynamicStyles.floatingSecondaryLight}
                />
                <Text className="absolute -top-8 -left-8 text-3xl">🚀</Text>
              </Box>
            </Animated.View>

            <VStack space="md" className="w-full px-4">
              <Button
                size="lg"
                className="rounded-full shadow-lg active:scale-95"
                style={dynamicStyles.primaryButton}
                onPress={() => router.replace("/")}
              >
                <ButtonText
                  className="font-semibold text-lg"
                  style={dynamicStyles.primaryButtonText}
                >
                  Take Me Home
                </ButtonText>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full active:scale-95"
                style={dynamicStyles.secondaryButton}
                onPress={() => router.back()}
              >
                <ButtonText
                  className="font-semibold text-lg"
                  style={dynamicStyles.secondaryButtonText}
                >
                  Go Back
                </ButtonText>
              </Button>
            </VStack>

            <Box className="mt-8 opacity-60">
              <Text
                className="text-sm text-center"
                style={dynamicStyles.footerText}
              >
                Error Code: 404 | Lost in the digital stacks.
              </Text>
            </Box>
          </VStack>
        </Animated.View>
      </Box>
    </Container>
  );
}

const styles = StyleSheet.create({
  centeredContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
