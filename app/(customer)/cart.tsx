// File: app/(customer)/cart.tsx
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { AppButton } from '@/components/AppButton';
import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';
import { SectionTitle } from '@/components/SectionTitle';
import { useTheme } from '@/hooks/useTheme';
import { currency } from '@/lib/format';
import { useCartStore } from '@/store/cart-store';

export default function CartScreen() {
  const { colors } = useTheme();
  const { items, restaurant, updateQuantity, removeItem } = useCartStore();

  const subtotal = items.reduce((sum, item) => {
    const customizations = item.customizations.reduce((acc, option) => acc + option.price, 0);
    return sum + (item.basePrice + customizations) * item.quantity;
  }, 0);

  if (!items.length) {
    return <EmptyState title="Your cart is empty" description="Add dishes from a restaurant to start checkout." />;
  }

  return (
    <Screen>
      <SectionTitle title="Your cart" subtitle={restaurant?.name || 'Restaurant'} />
      {items.map((item) => (
        <View key={item.itemId} style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
          <Text style={{ color: colors.mutedText }}>{currency(item.basePrice)} each</Text>
          <View style={styles.row}>
            <AppButton label="-" variant="ghost" onPress={() => updateQuantity(item.itemId, item.quantity - 1)} />
            <Text style={{ color: colors.text, fontWeight: '800', fontSize: 18 }}>{item.quantity}</Text>
            <AppButton label="+" variant="ghost" onPress={() => updateQuantity(item.itemId, item.quantity + 1)} />
          </View>
          <AppButton label="Remove" variant="ghost" onPress={() => removeItem(item.itemId)} />
        </View>
      ))}
      <View style={[styles.summary, { backgroundColor: colors.card }]}>
        <Text style={{ color: colors.text, fontWeight: '800' }}>Subtotal</Text>
        <Text style={{ color: colors.text, fontWeight: '800' }}>{currency(subtotal)}</Text>
      </View>
      <AppButton label="Continue to checkout" onPress={() => router.push('/(customer)/checkout')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 20, padding: 16, gap: 10 },
  name: { fontSize: 18, fontWeight: '800' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  summary: { borderRadius: 20, padding: 16, flexDirection: 'row', justifyContent: 'space-between' }
});
