// File: app/(restaurant)/dashboard.tsx
import { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { AppButton } from '@/components/AppButton';
import { EmptyState } from '@/components/EmptyState';
import { LoadingView } from '@/components/LoadingView';
import { Screen } from '@/components/Screen';
import { SectionTitle } from '@/components/SectionTitle';
import { getRestaurantOrders, getRestaurantsByOwner } from '@/services/firestore';
import { currency } from '@/lib/format';
import { useAuthStore } from '@/store/auth-store';
import type { Order, Restaurant } from '@/types';
import { useTheme } from '@/hooks/useTheme';

export default function RestaurantDashboardScreen() {
  const { colors } = useTheme();
  const profile = useAuthStore((s) => s.profile);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    Promise.all([getRestaurantsByOwner(profile.id), getRestaurantOrders(profile.id)])
      .then(([restaurantList, orderList]) => {
        setRestaurants(restaurantList);
        setOrders(orderList);
      })
      .finally(() => setLoading(false));
  }, [profile]);

  const totals = useMemo(() => {
    const revenue = orders.reduce((sum, order) => sum + order.restaurantNetAmount, 0);
    return {
      revenue,
      totalOrders: orders.length,
      activeOrders: orders.filter((order) => ['accepted', 'preparing', 'on_the_way'].includes(order.orderStatus)).length
    };
  }, [orders]);

  if (loading) return <LoadingView label="Loading owner dashboard..." />;
  if (!restaurants.length) {
    return <EmptyState title="Create your first restaurant" description="Restaurant owners can manage menu, orders, payouts, and subscription status here." buttonLabel="Create restaurant" onPress={() => router.push('/(restaurant)/restaurant-profile')} />;
  }

  return (
    <Screen>
      <SectionTitle title="Owner dashboard" subtitle="Manage menu, orders, earnings, and subscription status." />
      <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
        {[
          { label: 'Restaurants', value: restaurants.length },
          { label: 'Orders', value: totals.totalOrders },
          { label: 'Active', value: totals.activeOrders },
          { label: 'Net revenue', value: currency(totals.revenue) }
        ].map((card) => (
          <View key={card.label} style={{ width: '47%', backgroundColor: colors.card, borderRadius: 20, padding: 16, gap: 6 }}>
            <Text style={{ color: colors.mutedText }}>{card.label}</Text>
            <Text style={{ color: colors.text, fontSize: 22, fontWeight: '800' }}>{String(card.value)}</Text>
          </View>
        ))}
      </View>
      <AppButton label="Manage menu" onPress={() => router.push('/(restaurant)/menu')} />
      <AppButton label="Connect Stripe payouts" variant="ghost" onPress={() => router.push('/(restaurant)/stripe-connect')} />
    </Screen>
  );
}
