// File: app/(customer)/checkout.tsx
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import { AppButton } from '@/components/AppButton';
import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';
import { SectionTitle } from '@/components/SectionTitle';
import { createOrderFromCart, getAddresses, getRestaurant } from '@/firebase/firestore';
import { useTheme } from '@/hooks/useTheme';
import { createPaymentIntent } from '@/lib/stripe';
import { currency } from '@/lib/format';
import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';
import type { AppAddress, Restaurant } from '@/types';

export default function CheckoutScreen() {
  const { colors } = useTheme();
  const profile = useAuthStore((s) => s.profile);
  const { items, restaurant, clearCart } = useCartStore();
  const [addresses, setAddresses] = useState<AppAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AppAddress | null>(null);
  const [restaurantDoc, setRestaurantDoc] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!profile) return;
    getAddresses(profile.id).then((list) => {
      setAddresses(list);
      setSelectedAddress(list[0] || null);
    });
  }, [profile]);

  useEffect(() => {
    if (restaurant?.id) {
      getRestaurant(restaurant.id).then(setRestaurantDoc);
    }
  }, [restaurant]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => {
      const customizationTotal = item.customizations.reduce((acc, option) => acc + option.price, 0);
      return sum + (item.basePrice + customizationTotal) * item.quantity;
    }, 0);
    const deliveryFee = restaurant?.deliveryFee ?? 0;
    const tax = subtotal * 0.07;
    return { subtotal, deliveryFee, tax, total: subtotal + deliveryFee + tax };
  }, [items, restaurant]);

  const handlePay = async () => {
    if (!profile || !restaurant || !restaurantDoc || !selectedAddress) {
      Alert.alert('Missing data', 'Add an address and choose a restaurant first.');
      return;
    }

    try {
      setLoading(true);
      const orderId = await createOrderFromCart({
        customerId: profile.id,
        customerName: profile.name,
        customerEmail: profile.email,
        ownerId: restaurantDoc.ownerId,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        items,
        address: selectedAddress,
        deliveryFee: restaurant.deliveryFee
      });

      const stripePayload = await createPaymentIntent({
        orderId,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        amount: totals.total,
        customerEmail: profile.email
      });

      const { error } = await initPaymentSheet({
        merchantDisplayName: 'BiteFlow',
        paymentIntentClientSecret: stripePayload.paymentIntentClientSecret,
        customerEphemeralKeySecret: stripePayload.customerEphemeralKeySecret,
        customerId: stripePayload.customerId,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: { email: profile.email, name: profile.name }
      });

      if (error) throw new Error(error.message);

      const present = await presentPaymentSheet();
      if (present.error) throw new Error(present.error.message);

      clearCart();
      Alert.alert('Payment successful', 'Your order was placed successfully.');
      router.replace(`/(customer)/order/${orderId}` as never);
    } catch (error: any) {
      Alert.alert('Checkout failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) return <EmptyState title="Nothing to checkout" description="Your cart is empty." buttonLabel="Go back" onPress={() => router.back()} />;

  return (
    <Screen>
      <SectionTitle title="Checkout" subtitle="Stripe payment, platform commission, and restaurant payout ready." />
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.heading, { color: colors.text }]}>Delivery address</Text>
        {addresses.map((address) => {
          const active = selectedAddress?.id === address.id;
          return (
            <Pressable key={address.id} onPress={() => setSelectedAddress(address)} style={[styles.addressRow, { borderColor: active ? colors.primary : colors.border }]}>
              <Text style={{ color: colors.text, fontWeight: '700' }}>{address.label}</Text>
              <Text style={{ color: colors.mutedText }}>{address.line1}</Text>
            </Pressable>
          );
        })}
        <AppButton label="Manage addresses" variant="ghost" onPress={() => router.push('/(customer)/addresses')} />
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.heading, { color: colors.text }]}>Summary</Text>
        <Text style={{ color: colors.text }}>Subtotal: {currency(totals.subtotal)}</Text>
        <Text style={{ color: colors.text }}>Delivery: {currency(totals.deliveryFee)}</Text>
        <Text style={{ color: colors.text }}>Tax: {currency(totals.tax)}</Text>
        <Text style={{ color: colors.text, fontWeight: '800', fontSize: 18 }}>Total: {currency(totals.total)}</Text>
      </View>

      <AppButton label="Pay now" onPress={handlePay} loading={loading} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 22, padding: 16, gap: 12 },
  heading: { fontSize: 18, fontWeight: '800' },
  addressRow: { borderWidth: 1, borderRadius: 16, padding: 14, gap: 4 }
});
