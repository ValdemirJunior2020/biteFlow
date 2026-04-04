// File: app/(customer)/track/[id].tsx
import { Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useLocalSearchParams } from 'expo-router';
import { LoadingView } from '@/components/LoadingView';
import { Screen } from '@/components/Screen';
import { SectionTitle } from '@/components/SectionTitle';
import { useRealtimeOrder } from '@/hooks/useRealtimeOrder';

export default function TrackOrderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tracking, loading } = useRealtimeOrder(id);

  if (loading || !tracking) return <LoadingView label="Connecting to live order tracking..." />;

  return (
    <Screen>
      <SectionTitle title="Live order tracking" subtitle="Firebase live updates + React Native Maps." />
      <MapView style={{ width: '100%', height: 420, borderRadius: 24 }} initialRegion={{ ...tracking.customerLocation, latitudeDelta: 0.05, longitudeDelta: 0.05 }}>
        <Marker coordinate={tracking.restaurantLocation} title="Restaurant" />
        <Marker coordinate={tracking.customerLocation} title="Customer" />
        <Marker coordinate={tracking.courierLocation} title="Courier" pinColor="green" />
        <Polyline coordinates={[tracking.restaurantLocation, tracking.courierLocation, tracking.customerLocation]} strokeWidth={4} strokeColor="#FF8A2A" />
      </MapView>
      <View style={{ gap: 6 }}>
        <Text style={{ fontSize: 18, fontWeight: '800' }}>Status: {tracking.status}</Text>
        <Text>Restaurant → Courier → Customer</Text>
      </View>
    </Screen>
  );
}
