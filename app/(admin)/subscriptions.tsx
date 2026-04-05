// File: app/(admin)/subscriptions.tsx
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { LoadingView } from '@/components/LoadingView';
import { Screen } from '@/components/Screen';
import { SectionTitle } from '@/components/SectionTitle';
import { getAllSubscriptions } from '@/services/firestore';
import type { Restaurant } from '@/types';
import { useTheme } from '@/hooks/useTheme';

export default function AdminSubscriptionsScreen() {
  const { colors } = useTheme();
  const [items, setItems] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllSubscriptions().then(setItems).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingView label="Loading subscriptions..." />;

  return (
    <Screen>
      <SectionTitle title="Subscriptions" subtitle="Monitor plan mix, churn risk, and active SaaS tenants." />
      {items.map((restaurant) => (
        <View key={restaurant.id} style={{ backgroundColor: colors.card, borderRadius: 20, padding: 16, gap: 6 }}>
          <Text style={{ color: colors.text, fontWeight: '800' }}>{restaurant.name}</Text>
          <Text style={{ color: colors.text }}>Plan: {restaurant.subscriptionPlan || 'basic'}</Text>
          <Text style={{ color: colors.mutedText }}>Status: {restaurant.subscriptionStatus || 'inactive'}</Text>
        </View>
      ))}
    </Screen>
  );
}
