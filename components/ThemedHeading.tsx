import { getColor } from "@/constants/Colors";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { Heading, IHeadingProps } from "./ui/heading";

export default function ThemedHeading(props: IHeadingProps) {
  const { mode: theme } = useColorScheme();

  return (
    <Heading
      {...props}
      style={{
        color: getColor("text", theme),
      }}
    >
      {props.children}
    </Heading>
  );
}
