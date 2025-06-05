import { getColor } from "@/constants/Colors";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { ScrollView } from "react-native";

type ThemedScrollViewProps = React.ComponentProps<typeof ScrollView> & {
  children: React.ReactNode;
};

export default function ThemedScrollView({
  children,
  ...props
}: ThemedScrollViewProps) {
  const { mode } = useColorScheme();

  return (
    <ScrollView
      style={[{ backgroundColor: getColor("background", mode) }, props.style]}
      contentContainerStyle={[
        { backgroundColor: getColor("background", mode) },
        props.contentContainerStyle,
      ]}
      {...props}
    >
      {children}
    </ScrollView>
  );
}
