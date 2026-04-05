// File: app/(customer)/order/[id].tsx
import { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AppButton } from '@/components/AppButton';
import { LoadingView } from '@/components/LoadingView';
import { OrderStatusBadge } from '@/components/OrderStatusBadge';
import { Screen } from '@/components/Screen';
import { getCustomerOrders } from '@/services/firestore';
import { useAuthStore } from '@/store/auth-store';
import type { Order } from '@/types';
import { currency, shortDate } from '@/lib/format';

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const profile = useAuthStore((s) => s.profile);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!profile) return;
    getCustomerOrders(profile.id).then((orders) => setOrder(orders.find((entry) => entry.id === id) || null));
  }, [profile, id]);

  if (!order) return <LoadingView label="Loading order..." />;

  return (
    <Screen>
      <Text style={{ fontSize: 30, fontWeight: '800' }}>{order.restaurantName}</Text>
      <OrderStatusBadge status={order.orderStatus} />
      <Text>{shortDate(order.createdAt)}</Text>
      {order.items.map((item) => (
        <View key={item.itemId} style={{ gap: 4 }}>
          <Text style={{ fontSize: 16, fontWeight: '700' }}>{item.quantity} × {item.name}</Text>
          <Text>{currency(item.lineTotal)}</Text>
        </View>
      ))}
      <Text style={{ fontWeight: '800' }}>Total: {currency(order.total)}</Text>
      <AppButton label="Track on map" onPress={() => router.push(`/(customer)/track/${order.id}` as never)} />
      <AppButton label="Need support" variant="ghost" onPress={() => Alert.alert('Support', 'Connect this button to your support workflow.')} />
    </Screen>
  );
}
