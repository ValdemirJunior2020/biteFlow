// File: app/(customer)/(tabs)/account.tsx
import { Alert, Switch, Text, View } from 'react-native';
import { router } from 'expo-router';
import { AppButton } from '@/components/AppButton';
import { Screen } from '@/components/Screen';
import { SectionTitle } from '@/components/SectionTitle';
import { logout } from '@/services/auth';
import { useAuthStore } from '@/store/auth-store';

export default function AccountScreen() {
  const profile = useAuthStore((s) => s.profile);

  return (
    <Screen>
      <SectionTitle title="Account" subtitle="Different profile views per role are supported." />
      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 22, fontWeight: '800' }}>{profile?.name}</Text>
        <Text>{profile?.email}</Text>
        <Text>Role: {profile?.isSuperAdmin ? 'super_admin' : profile?.role}</Text>
      </View>
      <AppButton label="Saved addresses" onPress={() => router.push('/(customer)/addresses')} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text>Dark / light mode</Text>
        <Switch value={false} onValueChange={() => Alert.alert('Theme', 'The app follows system theme automatically.')} />
      </View>
      <AppButton label="Logout" variant="ghost" onPress={() => logout()} />
    </Screen>
  );
}
