// File: app/(admin)/orders.tsx
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { LoadingView } from '@/components/LoadingView';
import { OrderStatusBadge } from '@/components/OrderStatusBadge';
import { Screen } from '@/components/Screen';
import { SectionTitle } from '@/components/SectionTitle';
import { getAllOrders } from '@/services/firestore';
import { currency } from '@/lib/format';
import type { Order } from '@/types';
import { useTheme } from '@/hooks/useTheme';

export default function AdminOrdersScreen() {
  const { colors } = useTheme();
  const [items, setItems] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllOrders().then(setItems).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingView label="Loading all orders..." />;

  return (
    <Screen>
      <SectionTitle title="All platform orders" subtitle="Super admin view across every tenant and customer." />
      {items.map((order) => (
        <View key={order.id} style={{ backgroundColor: colors.card, borderRadius: 20, padding: 16, gap: 6 }}>
          <Text style={{ color: colors.text, fontWeight: '800' }}>{order.restaurantName}</Text>
          <OrderStatusBadge status={order.orderStatus} />
          <Text style={{ color: colors.text }}>Gross total: {currency(order.total)}</Text>
          <Text style={{ color: colors.text }}>Commission: {currency(order.commissionAmount)}</Text>
        </View>
      ))}
    </Screen>
  );
}
