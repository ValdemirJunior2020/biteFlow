// File: components/OrderStatusBadge.tsx
import { StyleSheet, Text, View } from 'react-native';
import { titleCase } from '@/lib/format';

const palette = {
  pending: '#F59E0B',
  accepted: '#0EA5E9',
  preparing: '#8B5CF6',
  on_the_way: '#22C55E',
  delivered: '#16A34A',
  cancelled: '#EF4444'
};

export function OrderStatusBadge({ status }: { status: keyof typeof palette }) {
  return (
    <View style={[styles.badge, { backgroundColor: `${palette[status]}20` }]}>
      <Text style={[styles.text, { color: palette[status] }]}>{titleCase(status)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  text: { fontSize: 12, fontWeight: '800' }
});
