// File: app/(customer)/(tabs)/orders.tsx
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { EmptyState } from '@/components/EmptyState';
import { LoadingView } from '@/components/LoadingView';
import { OrderStatusBadge } from '@/components/OrderStatusBadge';
import { Screen } from '@/components/Screen';
import { SectionTitle } from '@/components/SectionTitle';
import { getCustomerOrders } from '@/services/firestore';
import { useTheme } from '@/hooks/useTheme';
import { currency, shortDate } from '@/lib/format';
import { useAuthStore } from '@/store/auth-store';
import type { Order } from '@/types';

export default function CustomerOrdersScreen() {
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.profile);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getCustomerOrders(user.id).then(setOrders).finally(() => setLoading(false));
  }, [user]);

  if (loading) return <LoadingView label="Loading order history..." />;
  if (!orders.length) return <EmptyState title="No orders yet" description="Place your first order and it will appear here." />;

  return (
    <Screen>
      <SectionTitle title="Order history" subtitle="Customers can track every past and active order." />
      {orders.map((order) => (
        <Pressable key={order.id} onPress={() => router.push(`/(customer)/order/${order.id}` as never)} style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.row}>
            <Text style={[styles.title, { color: colors.text }]}>{order.restaurantName}</Text>
            <OrderStatusBadge status={order.orderStatus} />
          </View>
          <Text style={{ color: colors.mutedText }}>{shortDate(order.createdAt)}</Text>
          <Text style={{ color: colors.text, fontWeight: '700' }}>{currency(order.total)}</Text>
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 20, padding: 16, gap: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '800' }
});
