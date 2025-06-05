import { getColor } from "@/constants/Colors";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import type { VariantProps } from "@gluestack-ui/nativewind-utils";
import React from "react";
import { Text as RNText } from "react-native";
import { textStyle } from "./ui/text/styles"; // Adjust import path as needed

type ITextProps = React.ComponentProps<typeof RNText> &
  VariantProps<typeof textStyle> & {
    /**
     * The color variant to use from your theme colors
     * @default 'text'
     */
    colorVariant?: // Core text colors
    | "text"
      | "textSecondary"
      | "textTertiary"

      // Brand colors
      | "primary"
      | "primaryText"
      | "secondary"
      | "secondaryText"
      | "accent"
      | "accentText"

      // Interactive elements
      | "tint"
      | "icon"
      | "iconHover"

      // Navigation
      | "navbarText"
      | "navbarTextActive"

      // Status colors
      | "success"
      | "warning"
      | "error"
      | "info"

      // Form elements
      | "inputText"
      | "inputPlaceholder"

      // Background references (for special cases)
      | "background"
      | "navbarBackground"

      // Button text variants
      | "buttonPrimaryText"
      | "buttonSecondaryText"
      | "buttonGhostText";

    /**
     * Semantic variant for specific academic contexts
     * These provide predefined color combinations for common use cases
     */
    semantic?:
      | "heading" // Primary color, bold
      | "subheading" // Text secondary
      | "body" // Default text
      | "caption" // Text tertiary, smaller
      | "link" // Primary color, underline ready
      | "emphasis" // Accent color for highlighting
      | "muted" // Text tertiary
      | "success" // Success color
      | "warning" // Warning color
      | "error" // Error color
      | "info"; // Info color
  };

const ThemedText = React.forwardRef<
  React.ComponentRef<typeof RNText>,
  ITextProps
>(function ThemedText(
  {
    className,
    isTruncated,
    bold,
    underline,
    strikeThrough,
    size = "md",
    sub,
    italic,
    highlight,
    colorVariant,
    semantic,
    style,
    ...props
  },
  ref
) {
  const { mode } = useColorScheme();

  // Determine color based on semantic variant or explicit colorVariant
  let textColor: string;
  let appliedSize = size;
  let appliedBold = bold;
  let appliedUnderline = underline;

  if (semantic) {
    // Apply semantic styling presets
    switch (semantic) {
      case "heading":
        textColor = getColor("primary", mode);
        appliedBold = appliedBold ?? true;
        appliedSize = appliedSize === "md" ? "xl" : appliedSize;
        break;

      case "subheading":
        textColor = getColor("textSecondary", mode);
        appliedBold = appliedBold ?? true;
        appliedSize = appliedSize === "md" ? "lg" : appliedSize;
        break;

      case "body":
        textColor = getColor("text", mode);
        break;

      case "caption":
        textColor = getColor("textTertiary", mode);
        appliedSize = appliedSize === "md" ? "sm" : appliedSize;
        break;

      case "link":
        textColor = getColor("primary", mode);
        appliedUnderline = appliedUnderline ?? false; // Ready for underline but not applied by default
        break;

      case "emphasis":
        textColor = getColor("accent", mode);
        appliedBold = appliedBold ?? true;
        break;

      case "muted":
        textColor = getColor("textTertiary", mode);
        break;

      case "success":
        textColor = getColor("success", mode);
        break;

      case "warning":
        textColor = getColor("warning", mode);
        break;

      case "error":
        textColor = getColor("error", mode);
        break;

      case "info":
        textColor = getColor("info", mode);
        break;

      default:
        textColor = getColor("text", mode);
    }
  } else {
    // Use explicit colorVariant or default to 'text'
    const variant = colorVariant || "text";
    textColor = getColor(variant, mode);
  }

  return (
    <RNText
      className={textStyle({
        isTruncated,
        bold: appliedBold,
        underline: appliedUnderline,
        strikeThrough,
        size: appliedSize,
        sub,
        italic,
        highlight,
        class: className,
      })}
      style={[{ color: textColor }, style]}
      {...props}
      ref={ref}
    />
  );
});

ThemedText.displayName = "ThemedText";

export { ThemedText };
export type { ITextProps };
