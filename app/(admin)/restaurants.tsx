// File: app/(admin)/restaurants.tsx
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { LoadingView } from '@/components/LoadingView';
import { Screen } from '@/components/Screen';
import { SectionTitle } from '@/components/SectionTitle';
import { getRestaurants } from '@/firebase/firestore';
import type { Restaurant } from '@/types';
import { useTheme } from '@/hooks/useTheme';

export default function AdminRestaurantsScreen() {
  const { colors } = useTheme();
  const [items, setItems] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRestaurants().then(setItems).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingView label="Loading restaurants..." />;

  return (
    <Screen>
      <SectionTitle title="All restaurants" subtitle="Manage subscriptions, featured listings, and onboarding status." />
      {items.map((restaurant) => (
        <View key={restaurant.id} style={{ backgroundColor: colors.card, borderRadius: 20, padding: 16, gap: 6 }}>
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: '800' }}>{restaurant.name}</Text>
          <Text style={{ color: colors.mutedText }}>{restaurant.cuisine}</Text>
          <Text style={{ color: colors.text }}>Plan: {restaurant.subscriptionPlan || 'basic'}</Text>
          <Text style={{ color: colors.text }}>Stripe connected: {restaurant.stripeOnboardingComplete ? 'Yes' : 'No'}</Text>
        </View>
      ))}
    </Screen>
  );
}
