import { getColor } from "@/constants/Colors";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { Heading } from "./ui/heading";

type ThemedHeadingProps = {
  children: React.ReactNode;
  isTruncated?: boolean;
  bold?: boolean;
  underline?: boolean;
  strikeThrough?: boolean;
  sub?: boolean;
  italic?: boolean;
  highlight?: boolean;
  size?: "5xl" | "4xl" | "3xl" | "2xl" | "xl" | "lg" | "md" | "sm" | "xs";
};

export default function ThemedHeading({
  children,
  isTruncated = false,
  bold = false,
  underline = false,
  strikeThrough = false,
  sub = false,
  italic = false,
  highlight = false,
  size = "md",
}: ThemedHeadingProps) {
  const { mode: theme } = useColorScheme();

  return (
    <Heading
      size={size}
      isTruncated={isTruncated}
      bold={bold}
      underline={underline}
      strikeThrough={strikeThrough}
      sub={sub}
      italic={italic}
      highlight={highlight}
      style={{
        color: getColor("text", theme),
      }}
    >
      {children}
    </Heading>
  );
}
