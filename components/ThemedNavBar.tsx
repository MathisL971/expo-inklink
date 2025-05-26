import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { View } from "react-native";
import ColorSchemeToggleButton from "./ColorSchemeToggleButton";
import { ThemedButton } from "./ThemedButton";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export default function ThemedNavBar() {
    const router = useRouter();

    return (
        <ThemedView 
            lightColor={Colors.light.navbarBackground} 
            darkColor={Colors.dark.navbarBackground} 
            style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 32, paddingVertical: 16 }}
        >
            <ThemedText type="title" onPress={() => router.navigate('/')}>Inklink</ThemedText>
            <View style={{ display: 'flex', flexDirection: 'row', gap: 14 }}>  
                <ColorSchemeToggleButton />
                <ThemedButton title='Sign in' action='primary' size='sm' variant='solid' onPress={() => router.navigate('/(auth)/sign-in')} />
                <ThemedButton title='Sign up' action='primary' size='sm' variant='solid' onPress={() => router.navigate('/(auth)/sign-up')} />
            </View>
        </ThemedView>
    );
}