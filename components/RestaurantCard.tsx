// File: components/RestaurantCard.tsx
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Star } from 'phosphor-react-native';
import { useTheme } from '@/hooks/useTheme';
import type { Restaurant } from '@/types';

export function RestaurantCard({ restaurant, onPress }: { restaurant: Restaurant; onPress?: () => void }) {
  const { colors } = useTheme();

  return (
    <Animated.View entering={FadeInDown.springify()}>
      <Pressable onPress={onPress} style={[styles.card, { backgroundColor: colors.card }]}>
        <Image
          source={{ uri: restaurant.coverURL || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop' }}
          style={styles.image}
        />
        <View style={styles.body}>
          <Text style={[styles.title, { color: colors.text }]}>{restaurant.name}</Text>
          <Text style={{ color: colors.mutedText }}>{restaurant.cuisine}</Text>
          <View style={styles.meta}>
            <Star size={18} color="#FFB020" weight="fill" />
            <Text style={{ color: colors.text }}>{restaurant.ratingAvg.toFixed(1)}</Text>
            <Text style={{ color: colors.mutedText }}>• {restaurant.etaMinutes} min</Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 20, overflow: 'hidden', flex: 1, minWidth: 0 },
  image: { width: '100%', aspectRatio: 16 / 9 },
  body: { padding: 14, gap: 6 },
  title: { fontSize: 16, fontWeight: '700' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 }
});
