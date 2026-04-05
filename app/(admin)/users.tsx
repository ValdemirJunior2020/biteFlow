// File: app/(admin)/users.tsx
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { LoadingView } from '@/components/LoadingView';
import { Screen } from '@/components/Screen';
import { SectionTitle } from '@/components/SectionTitle';
import { getAllUsers } from '@/services/firestore';
import type { AppUser } from '@/types';
import { useTheme } from '@/hooks/useTheme';

export default function AdminUsersScreen() {
  const { colors } = useTheme();
  const [items, setItems] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers().then(setItems).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingView label="Loading users..." />;

  return (
    <Screen>
      <SectionTitle title="Users" subtitle="Customers, restaurant owners, and platform admins." />
      {items.map((user) => (
        <View key={user.id} style={{ backgroundColor: colors.card, borderRadius: 20, padding: 16, gap: 6 }}>
          <Text style={{ color: colors.text, fontWeight: '800' }}>{user.name}</Text>
          <Text style={{ color: colors.mutedText }}>{user.email}</Text>
          <Text style={{ color: colors.text }}>Role: {user.isSuperAdmin ? 'super_admin' : user.role}</Text>
        </View>
      ))}
    </Screen>
  );
}
