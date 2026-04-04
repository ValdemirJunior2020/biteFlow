// File: app/(restaurant)/settings.tsx
import { Text } from 'react-native';
import { AppButton } from '@/components/AppButton';
import { Screen } from '@/components/Screen';
import { SectionTitle } from '@/components/SectionTitle';
import { logout } from '@/firebase/auth';
import { useAuthStore } from '@/store/auth-store';

export default function RestaurantSettingsScreen() {
  const profile = useAuthStore((s) => s.profile);
  return (
    <Screen>
      <SectionTitle title="Settings" subtitle="Priority support, owner profile, and logout." />
      <Text>{profile?.email}</Text>
      <AppButton label="Logout" variant="ghost" onPress={() => logout()} />
    </Screen>
  );
}
