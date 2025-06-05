import { getColor } from "@/constants/Colors";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { ScrollView } from "react-native";
import ThemedScrollView from "./ThemedScrollView";

type ContainerProps = React.ComponentProps<typeof ScrollView> & {
  children: React.ReactNode;
  className?: string;
  contentContainerStyle?: any;
};

export default function Container({
  children,
  className = "",
  contentContainerStyle,
  ...props
}: ContainerProps) {
  const { mode } = useColorScheme();
  const backgroundColor = getColor("background", mode);

  const defaultContentClasses =
    "flex-grow flex-col py-8 px-4 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-40";

  const combinedContentClasses = `${defaultContentClasses} ${className}`.trim();

  return (
    <ThemedScrollView
      {...props}
      style={[{ flex: 1, backgroundColor }, props.style]} // Ensure ScrollView itself has background
      contentContainerClassName={combinedContentClasses}
      contentContainerStyle={[{ backgroundColor }, contentContainerStyle]}
      // Add these props for themed overscroll area
      bounces={true}
      alwaysBounceVertical={true}
    >
      {children}
    </ThemedScrollView>
  );
}
