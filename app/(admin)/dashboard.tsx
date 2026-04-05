// File: app/(admin)/dashboard.tsx
import { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { LoadingView } from '@/components/LoadingView';
import { Screen } from '@/components/Screen';
import { SectionTitle } from '@/components/SectionTitle';
import { getAllOrders, getAllSubscriptions, getAllUsers, getRestaurants } from '@/services/firestore';
import { currency } from '@/lib/format';
import type { Order, Restaurant, AppUser } from '@/types';
import { useTheme } from '@/hooks/useTheme';

export default function AdminDashboardScreen() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);

  useEffect(() => {
    Promise.all([getRestaurants(), getAllOrders(), getAllUsers(), getAllSubscriptions()])
      .then(([restaurantList, orderList, userList]) => {
        setRestaurants(restaurantList);
        setOrders(orderList);
        setUsers(userList);
      })
      .finally(() => setLoading(false));
  }, []);

  const totals = useMemo(() => {
    const commissions = orders.reduce((sum, order) => sum + order.commissionAmount, 0);
    return { commissions };
  }, [orders]);

  if (loading) return <LoadingView label="Loading admin panel..." />;

  return (
    <Screen>
      <SectionTitle title="Super admin panel" subtitle="Platform owner control center: restaurants, orders, subscriptions, and revenue." />
      {[
        { label: 'Restaurants', value: restaurants.length },
        { label: 'Users', value: users.length },
        { label: 'Orders', value: orders.length },
        { label: 'Platform revenue', value: currency(totals.commissions) }
      ].map((card) => (
        <View key={card.label} style={{ backgroundColor: colors.card, borderRadius: 20, padding: 16, gap: 6 }}>
          <Text style={{ color: colors.mutedText }}>{card.label}</Text>
          <Text style={{ color: colors.text, fontSize: 24, fontWeight: '800' }}>{String(card.value)}</Text>
        </View>
      ))}
    </Screen>
  );
}
