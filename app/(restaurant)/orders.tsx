// File: app/(restaurant)/orders.tsx
import { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { AppButton } from '@/components/AppButton';
import { EmptyState } from '@/components/EmptyState';
import { LoadingView } from '@/components/LoadingView';
import { OrderStatusBadge } from '@/components/OrderStatusBadge';
import { Screen } from '@/components/Screen';
import { SectionTitle } from '@/components/SectionTitle';
import { getRestaurantOrders, updateOrderStatus } from '@/services/firestore';
import { useAuthStore } from '@/store/auth-store';
import { currency } from '@/lib/format';
import type { Order } from '@/types';
import { useTheme } from '@/hooks/useTheme';

const nextStatus: Record<string, Order['orderStatus']> = {
  pending: 'accepted',
  accepted: 'preparing',
  preparing: 'on_the_way',
  on_the_way: 'delivered',
  delivered: 'delivered',
  cancelled: 'cancelled'
};

export default function RestaurantOrdersScreen() {
  const { colors } = useTheme();
  const profile = useAuthStore((s) => s.profile);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    if (!profile) return;
    getRestaurantOrders(profile.id).then(setOrders).finally(() => setLoading(false));
  };

  useEffect(() => {
    refresh();
  }, [profile]);

  if (loading) return <LoadingView label="Loading incoming orders..." />;
  if (!orders.length) return <EmptyState title="No restaurant orders" description="Customer orders will appear here in real time." />;

  return (
    <Screen>
      <SectionTitle title="Restaurant orders" subtitle="Accept, prepare, dispatch, and complete orders." />
      {orders.map((order) => (
        <View key={order.id} style={{ backgroundColor: colors.card, borderRadius: 20, padding: 16, gap: 10 }}>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800' }}>{order.customerName}</Text>
          <OrderStatusBadge status={order.orderStatus} />
          <Text style={{ color: colors.mutedText }}>{currency(order.total)}</Text>
          <AppButton
            label={`Advance to ${nextStatus[order.orderStatus].replace(/_/g, ' ')}`}
            onPress={async () => {
              try {
                await updateOrderStatus(order.id, nextStatus[order.orderStatus]);
                refresh();
              } catch (error: any) {
                Alert.alert('Update failed', error.message);
              }
            }}
          />
        </View>
      ))}
    </Screen>
  );
}
