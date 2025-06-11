import { getColor, type Theme } from "@/constants/Colors"; // Assuming Theme type is exported
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { isAdmin } from "@/utils/auth";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Href, Link, usePathname, useRouter } from "expo-router"; // Added usePathname
import { Pressable, StyleSheet, View } from "react-native"; // Added StyleSheet and Pressable
import ColorSchemeToggleButton from "./ColorSchemeToggleButton";
import { SignOutButton } from "./SignOutButton";
import { ThemedText } from "./ThemedText";

// Helper component for themed navigation links
type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  currentPathname: string;
  theme: Theme; // Use the Theme type from Colors.ts
};

const NavLink: React.FC<NavLinkProps> = ({
  href,
  children,
  currentPathname,
  theme,
}) => {
  const isActive = currentPathname === href;
  const linkColor = isActive
    ? getColor("navbarTextActive", theme)
    : getColor("navbarText", theme);

  // For web, you might want hover effects. For mobile, Pressable provides feedback.
  // This example focuses on color based on active state.
  return (
    <Link href={href as Href} asChild>
      <Pressable>
        {(
          { hovered, pressed } // expo-router Link with asChild can pass down hover/pressed
        ) => (
          <ThemedText
            style={{
              color: linkColor,
              // Example of hover/press style (opacity, or could change color slightly)
              // This is more advanced and might need ThemedText to support it or use Animated.View
              opacity: hovered || pressed ? 0.7 : 1,
            }}
          >
            {children}
          </ThemedText>
        )}
      </Pressable>
    </Link>
  );
};

export default function ThemedNavBar() {
  const { mode: theme } = useColorScheme();
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const pathname = usePathname(); // Get current pathname for active link styling

  return (
    <View
      className="flex-row items-center justify-between py-4 px-6 md:px-12" // Adjusted padding for responsiveness
      style={[
        styles.navbar,
        {
          backgroundColor: getColor("navbarBackground", theme),
          borderBottomColor: getColor("navbarBorder", theme),
        },
      ]}
    >
      <Link href={"/"} asChild>
        <Pressable>
          {({ hovered, pressed }) => (
            <ThemedText
              colorVariant="text"
              size="3xl"
              bold
              style={{ opacity: hovered || pressed ? 0.8 : 1 }}
            >
              Soscitea
            </ThemedText>
          )}
        </Pressable>
      </Link>
      <View className="flex-row gap-4 md:gap-6 items-center">
        {/* Adjusted gap */}
        {isSignedIn && user ? (
          <>
            {isAdmin(user) && (
              <>
                <NavLink
                  href="/events"
                  currentPathname={pathname}
                  theme={theme}
                >
                  Events
                </NavLink>
                <NavLink href="/users" currentPathname={pathname} theme={theme}>
                  Users
                </NavLink>
              </>
            )}
            <NavLink href="/settings" currentPathname={pathname} theme={theme}>
              Settings
            </NavLink>
            <SignOutButton size="sm" />
          </>
        ) : (
          <>
            {/* <ThemedButton
              title="Sign in"
              action="primary"
              size="sm"
              variant="solid"
              onPress={() => router.navigate("/(auth)/sign-in")}
            />
            <ThemedButton
              title="Sign up"
              action="secondary"
              size="sm"
              variant="solid"
              onPress={() => router.navigate("/(auth)/sign-up")}
            /> */}
          </>
        )}
        <ColorSchemeToggleButton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
