import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { Platform, Pressable } from "react-native";
import { Icon, MoonIcon, SunIcon } from "./ui/icon";

export default function ColorSchemeToggleButton() {
  const { mode, setMode } = useColorScheme();

  return (
    <Pressable
      className="rounded-full"
      onPress={() => setMode(mode === "light" ? "dark" : "light")}
      style={{
        marginRight: Platform.OS !== "web" ? 16 : 0,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {mode === "dark" ? (
        <Icon as={SunIcon} size="xl" color={"white"} />
      ) : (
        <Icon as={MoonIcon} size="xl" color={"black"} />
      )}
    </Pressable>
  );
}
