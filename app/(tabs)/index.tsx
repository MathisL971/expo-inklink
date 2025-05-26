import { SignOutButton } from '@/components/SignOutButton';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();
  
  return (
    <ThemedView style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <SignedIn>
        <ThemedText>Hello {user?.emailAddresses[0].emailAddress}</ThemedText>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <ThemedView>
          {Platform.OS !== "web" && (
            <ThemedView style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <ThemedButton title='Sign in' action='primary' size='xl' variant='solid' onPress={() => router.navigate('/(auth)/sign-in')} />
              <ThemedButton title='Sign up' action='primary' size='xl' variant='solid' onPress={() => router.navigate('/(auth)/sign-up')} />
            </ThemedView>
          )}
        </ThemedView>
      </SignedOut>
    </ThemedView>
  )
}
