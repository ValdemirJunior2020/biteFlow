// File: app/(restaurant)/earnings.tsx
import { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { LoadingView } from '@/components/LoadingView';
import { Screen } from '@/components/Screen';
import { SectionTitle } from '@/components/SectionTitle';
import { getRestaurantOrders } from '@/services/firestore';
import { useAuthStore } from '@/store/auth-store';
import { currency } from '@/lib/format';
import type { Order } from '@/types';
import { useTheme } from '@/hooks/useTheme';

export default function EarningsScreen() {
  const { colors } = useTheme();
  const profile = useAuthStore((s) => s.profile);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    getRestaurantOrders(profile.id).then(setOrders).finally(() => setLoading(false));
  }, [profile]);

  const totals = useMemo(() => {
    const gross = orders.reduce((sum, order) => sum + order.subtotal, 0);
    const commission = orders.reduce((sum, order) => sum + order.commissionAmount, 0);
    const net = orders.reduce((sum, order) => sum + order.restaurantNetAmount, 0);
    return { gross, commission, net };
  }, [orders]);

  if (loading) return <LoadingView label="Loading earnings..." />;

  return (
    <Screen>
      <SectionTitle title="Earnings" subtitle="Automatic platform commission deduction and net owner earnings." />
      {[
        { label: 'Gross sales', value: currency(totals.gross) },
        { label: 'Platform commission', value: currency(totals.commission) },
        { label: 'Restaurant net', value: currency(totals.net) }
      ].map((card) => (
        <View key={card.label} style={{ backgroundColor: colors.card, borderRadius: 20, padding: 16, gap: 6 }}>
          <Text style={{ color: colors.mutedText }}>{card.label}</Text>
          <Text style={{ color: colors.text, fontSize: 24, fontWeight: '800' }}>{card.value}</Text>
        </View>
      ))}
    </Screen>
  );
}
