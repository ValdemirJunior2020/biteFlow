// File: app/(customer)/(tabs)/index.tsx
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { List, MagnifyingGlass, ShoppingCart, UserCircle } from 'phosphor-react-native';
import { Screen } from '@/components/Screen';
import { SectionTitle } from '@/components/SectionTitle';
import { RestaurantCard } from '@/components/RestaurantCard';
import { LoadingView } from '@/components/LoadingView';
import { EmptyState } from '@/components/EmptyState';
import { useTheme } from '@/hooks/useTheme';
import { CUISINES } from '@/lib/constants';
import { getRestaurants } from '@/firebase/firestore';
import { useCartStore } from '@/store/cart-store';
import type { Restaurant } from '@/types';
import { getDistanceKm } from '@/lib/format';

export default function CustomerHomeScreen() {
  const { colors } = useTheme();
  const cartCount = useCartStore((s) => s.items.length);
  const [search, setSearch] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
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
    const matchesSearch = [restaurant.name, restaurant.cuisine, restaurant.description].join(' ').toLowerCase().includes(search.toLowerCase());
    const matchesCuisine = !selectedCuisine || restaurant.cuisine === selectedCuisine;
    return matchesSearch && matchesCuisine;
  }), [restaurants, search, selectedCuisine]);

  if (loading) return <LoadingView label="Loading nearby restaurants..." />;

  return (
    <Screen>
      <View style={styles.headerRow}>
        <List size={28} color={colors.text} />
        <View style={styles.actions}>
          <Pressable onPress={() => router.push('/(customer)/cart')} style={[styles.iconButton, { backgroundColor: colors.card }]}>
            <ShoppingCart size={22} color={colors.text} />
            {cartCount ? <View style={styles.dot}><Text style={styles.dotText}>{cartCount}</Text></View> : null}
          </Pressable>
          <Pressable onPress={() => router.push('/(customer)/(tabs)/account')} style={[styles.iconButton, { backgroundColor: colors.card }]}>
            <UserCircle size={24} color={colors.text} />
          </Pressable>
        </View>
      </View>

      <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
        <MagnifyingGlass size={24} color={colors.mutedText} />
        <TextInput placeholder="Search restaurants or dishes..." placeholderTextColor={colors.mutedText} value={search} onChangeText={setSearch} style={{ flex: 1, color: colors.text, fontSize: 16 }} />
      </View>

      <View style={styles.categories}>
        {CUISINES.slice(0, 5).map((cuisine) => {
          const active = selectedCuisine === cuisine;
          return (
            <Pressable key={cuisine} onPress={() => setSelectedCuisine(active ? '' : cuisine)} style={[styles.categoryCard, { backgroundColor: active ? '#FFE8D6' : colors.card }]}>
              <Text style={[styles.categoryText, { color: colors.text }]}>{cuisine}</Text>
            </Pressable>
          );
        })}
      </View>

      <SectionTitle title="Popular nearby" subtitle="Styled to match your iOS home mock." />
      {filtered.length === 0 ? (
        <EmptyState title="No restaurants yet" description="Add restaurant records in Firestore and they will appear here." />
      ) : (
        <View style={styles.grid}>
          {filtered.map((restaurant) => {
            const distanceKm = coords ? getDistanceKm(coords.latitude, coords.longitude, restaurant.location.latitude, restaurant.location.longitude) : null;
            return (
              <View key={restaurant.id} style={{ width: '48%', gap: 6 }}>
                <RestaurantCard restaurant={restaurant} onPress={() => router.push(`/(customer)/restaurant/${restaurant.id}` as never)} />
                {distanceKm !== null ? <Text style={{ color: colors.mutedText }}>{distanceKm.toFixed(1)} km away</Text> : null}
              </View>
            );
          })}
        </View>
      )}

      <Pressable onPress={() => Alert.alert('Tracking', 'Open the latest order from the Orders tab to watch live map tracking.')} style={[styles.banner, { backgroundColor: colors.card }]}>
        <Text style={[styles.bannerTitle, { color: colors.text }]}>Active Order Tracking</Text>
        <Text style={{ color: colors.mutedText }}>Live courier movement and order status updates.</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  actions: { flexDirection: 'row', gap: 12 },
  iconButton: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute', right: -2, top: -2, backgroundColor: '#FF8A2A', minWidth: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  dotText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  searchBar: { minHeight: 58, borderRadius: 18, alignItems: 'center', flexDirection: 'row', paddingHorizontal: 16, gap: 10 },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoryCard: { paddingHorizontal: 18, minHeight: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  categoryText: { fontSize: 15, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, justifyContent: 'space-between' },
  banner: { borderRadius: 22, padding: 18, gap: 4 },
  bannerTitle: { fontSize: 24, fontWeight: '800' }
});
