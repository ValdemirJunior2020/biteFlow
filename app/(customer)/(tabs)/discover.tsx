// File: app/(customer)/(tabs)/discover.tsx
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { Screen } from '@/components/Screen';
import { SectionTitle } from '@/components/SectionTitle';
import { RestaurantCard } from '@/components/RestaurantCard';
import { LoadingView } from '@/components/LoadingView';
import { CUISINES } from '@/lib/constants';
import { getRestaurants } from '@/services/firestore';
import { useTheme } from '@/hooks/useTheme';
import { getDistanceKm } from '@/lib/format';
import type { Restaurant } from '@/types';

export default function DiscoverScreen() {
  const { colors } = useTheme();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ cuisine: '', maxPrice: 4, minRating: 0, maxDistance: 20 });
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    getRestaurants().then(setRestaurants).finally(() => setLoading(false));
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const current = await Location.getCurrentPositionAsync({});
      setCoords(current.coords);
    })().catch(() => undefined);
  }, []);

  const filtered = useMemo(() => restaurants.filter((restaurant) => {
    const distance = coords ? getDistanceKm(coords.latitude, coords.longitude, restaurant.location.latitude, restaurant.location.longitude) : 0;
    return ((!filters.cuisine || restaurant.cuisine === filters.cuisine) && restaurant.priceLevel <= filters.maxPrice && restaurant.ratingAvg >= filters.minRating && (distance === 0 || distance <= filters.maxDistance));
  }), [restaurants, filters, coords]);

  if (loading) return <LoadingView label="Filtering restaurants..." />;

  return (
    <Screen>
      <SectionTitle title="Search & filter" subtitle="Cuisine, price, rating, and distance filters are live." />
      <View style={styles.group}>
        <Text style={{ color: colors.text, fontWeight: '700' }}>Cuisine</Text>
        <View style={styles.wrap}>
          {['', ...CUISINES].map((cuisine) => {
            const active = filters.cuisine === cuisine;
            return (
              <Pressable key={cuisine || 'all'} onPress={() => setFilters((prev) => ({ ...prev, cuisine }))} style={[styles.pill, { backgroundColor: active ? colors.primary : colors.card }]}>
                <Text style={{ color: active ? '#fff' : colors.text, fontWeight: '700' }}>{cuisine || 'All'}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <View style={styles.grid}>
        {filtered.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} onPress={() => router.push(`/(customer)/restaurant/${restaurant.id}` as never)} />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  group: { gap: 10 },
  wrap: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  pill: { minHeight: 44, paddingHorizontal: 14, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  grid: { flexDirection: 'row', gap: 12, justifyContent: 'space-between', flexWrap: 'wrap' }
});
