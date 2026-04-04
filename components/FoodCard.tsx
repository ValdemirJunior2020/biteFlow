// File: components/FoodCard.tsx
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { PlusCircle } from 'phosphor-react-native';
import { useTheme } from '@/hooks/useTheme';
import { currency } from '@/lib/format';
import type { MenuItem } from '@/types';

export function FoodCard({ item, onAdd }: { item: MenuItem; onAdd?: () => void }) {
  const { colors } = useTheme();
  return (
    <Animated.View entering={FadeInRight.springify()} style={[styles.card, { backgroundColor: colors.card }]}>
      <Image
        source={{ uri: item.imageURL || 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop' }}
        style={styles.image}
      />
      <View style={styles.body}>
        <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
        <Text numberOfLines={2} style={{ color: colors.mutedText }}>{item.description}</Text>
        <View style={styles.row}>
          <Text style={[styles.price, { color: colors.text }]}>{currency(item.price)}</Text>
          <Pressable onPress={onAdd}>
            <PlusCircle size={28} color={colors.primary} weight="fill" />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 22, overflow: 'hidden', width: '48%' },
  image: { width: '100%', height: 116 },
  body: { padding: 12, gap: 8 },
  name: { fontSize: 17, fontWeight: '800' },
  price: { fontSize: 16, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }
});
