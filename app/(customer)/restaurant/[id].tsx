// File: app/(customer)/restaurant/[id].tsx
import { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { AppButton } from '@/components/AppButton';
import { FoodCard } from '@/components/FoodCard';
import { LoadingView } from '@/components/LoadingView';
import { Screen } from '@/components/Screen';
import { getMenuByRestaurant, getRestaurant } from '@/services/firestore';
import { useCartStore } from '@/store/cart-store';
import type { MenuItem, Restaurant } from '@/types';
import { useTheme } from '@/hooks/useTheme';

export default function RestaurantDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);
  const setRestaurantInCart = useCartStore((s) => s.setRestaurant);

  useEffect(() => {
    if (!id) return;
    Promise.all([getRestaurant(id), getMenuByRestaurant(id)])
      .then(([restaurantValue, menuValue]) => {
        setRestaurant(restaurantValue);
        setItems(menuValue);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingView label="Loading restaurant..." />;
  if (!restaurant) return <LoadingView label="Restaurant not found" />;

  return (
    <Screen>
      <Image source={{ uri: restaurant.coverURL || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop' }} style={styles.hero} />
      <Text style={[styles.title, { color: colors.text }]}>{restaurant.name}</Text>
      <Text style={{ color: colors.mutedText }}>{restaurant.description}</Text>
      <Text style={{ color: colors.mutedText }}>{restaurant.location.address}</Text>
      <AppButton label="Add from this restaurant" variant="ghost" onPress={() => setRestaurantInCart({ id: restaurant.id, name: restaurant.name, deliveryFee: restaurant.deliveryFee })} />
      <View style={styles.grid}>
        {items.map((item) => (
          <FoodCard
            key={item.id}
            item={item}
            onAdd={() => {
              setRestaurantInCart({ id: restaurant.id, name: restaurant.name, deliveryFee: restaurant.deliveryFee });
              addItem(item, 1, []);
              Alert.alert('Added to cart', item.name);
            }}
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { width: '100%', aspectRatio: 16 / 7, borderRadius: 20 },
  title: { fontSize: 24, fontWeight: '800' },
  grid: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' }
});
