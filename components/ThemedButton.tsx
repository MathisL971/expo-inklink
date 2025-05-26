import { type PressableProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { Button, ButtonText } from "./ui/button";

type ThemedButtonProps = PressableProps & {
    title: string;
    action: 'primary' | 'secondary' | 'positive' | 'negative' | 'default'
    size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    variant: 'link' | 'outline' | 'solid'
    lightColor?: string;
    darkColor?: string;
    lightBackgroundColor?: string;
    darkBackgroundColor?: string;
};

export function ThemedButton({
    title,
    action,
    size,
    variant,
    lightColor,
    darkColor,
    lightBackgroundColor,
    darkBackgroundColor,
    ...rest
 }: ThemedButtonProps) {
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'buttonText');
    const backgroundColor = useThemeColor({ light: lightBackgroundColor, dark: darkBackgroundColor }, 'buttonBackground')

    return (
        <Button size={size} variant={variant} action={action} style={{ backgroundColor }} {...rest}>
            <ButtonText style={{ color }}>{title}</ButtonText>
        </Button>
    );
}

