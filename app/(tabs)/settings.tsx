
import { SignOutButton } from '@/components/SignOutButton';
import { ThemedView } from '@/components/ThemedView';

export default function SettingsScreen() {
  return (
    <ThemedView className='flex-1 flex-col items-center justify-center'>
      <SignOutButton />
    </ThemedView>
  );
}
