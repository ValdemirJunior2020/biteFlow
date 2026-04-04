// File: app/(restaurant)/menu.tsx
import { useEffect, useState } from 'react';
import { Pressable, Text } from 'react-native';
import { router } from 'expo-router';
import { AppButton } from '@/components/AppButton';
import { EmptyState } from '@/components/EmptyState';
import { LoadingView } from '@/components/LoadingView';
import { Screen } from '@/components/Screen';
import { SectionTitle } from '@/components/SectionTitle';
import { getMenuByRestaurant, getRestaurantsByOwner } from '@/firebase/firestore';
import { currency } from '@/lib/format';
import { useAuthStore } from '@/store/auth-store';
import type { MenuItem, Restaurant } from '@/types';
import { useTheme } from '@/hooks/useTheme';

export default function MenuScreen() {
  const { colors } = useTheme();
  const profile = useAuthStore((s) => s.profile);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    getRestaurantsByOwner(profile.id).then(async (restaurants) => {
      const first = restaurants[0] || null;
      setRestaurant(first);
      if (first) setItems(await getMenuByRestaurant(first.id));
      setLoading(false);
    });
  }, [profile]);

  if (loading) return <LoadingView label="Loading menu..." />;
  if (!restaurant) return <EmptyState title="No restaurant yet" description="Create a restaurant profile first." buttonLabel="Create restaurant" onPress={() => router.push('/(restaurant)/restaurant-profile')} />;

  return (
    <Screen>
      <SectionTitle title="Menu manager" subtitle="Create categories, products, pricing, and images." />
      <AppButton label="Add menu item" onPress={() => router.push('/(restaurant)/menu/new')} />
      {!items.length ? (
        <EmptyState title="No menu items" description="Add your first dish to start receiving orders." />
      ) : (
        items.map((item) => (
          <Pressable key={item.id} onPress={() => router.push(`/(restaurant)/menu/${item.id}` as never)} style={{ backgroundColor: colors.card, borderRadius: 20, padding: 16, gap: 6 }}>
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: '800' }}>{item.name}</Text>
            <Text style={{ color: colors.mutedText }}>{item.category}</Text>
            <Text style={{ color: colors.text, fontWeight: '700' }}>{currency(item.price)}</Text>
          </Pressable>
        ))
      )}
    </Screen>
  );
}
