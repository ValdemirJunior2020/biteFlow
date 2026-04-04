// File: app/(customer)/addresses.tsx
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import MapView, { Marker, type MapPressEvent } from 'react-native-maps';
import { AppButton } from '@/components/AppButton';
import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';
import { SectionTitle } from '@/components/SectionTitle';
import { getAddresses, saveAddress } from '@/firebase/firestore';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/auth-store';
import type { AppAddress } from '@/types';

export default function AddressesScreen() {
  const { colors } = useTheme();
  const profile = useAuthStore((s) => s.profile);
  const [addresses, setAddresses] = useState<AppAddress[]>([]);
  const [selected, setSelected] = useState({ latitude: 26.6168, longitude: -80.0684 });
  const [label, setLabel] = useState('Home');
  const [line1, setLine1] = useState('');

  const refresh = () => {
    if (!profile) return;
    getAddresses(profile.id).then(setAddresses);
  };

  useEffect(() => {
    refresh();
  }, [profile]);

  const handleMapPress = (event: MapPressEvent) => setSelected(event.nativeEvent.coordinate);

  const handleSave = async () => {
    if (!profile) return;
    await saveAddress({
      userId: profile.id,
      label,
      line1,
      city: 'Lake Worth Beach',
      state: 'FL',
      postalCode: '33460',
      latitude: selected.latitude,
      longitude: selected.longitude,
      isDefault: addresses.length === 0
    });
    Alert.alert('Saved', 'Address saved.');
    setLine1('');
    refresh();
  };

  return (
    <Screen>
      <SectionTitle title="Addresses" subtitle="Manage multiple saved addresses with a map picker." />
      <MapView style={styles.map} initialRegion={{ ...selected, latitudeDelta: 0.04, longitudeDelta: 0.04 }} onPress={handleMapPress}>
        <Marker coordinate={selected} />
      </MapView>
      <View style={[styles.form, { backgroundColor: colors.card }]}>
        <TextInput value={label} onChangeText={setLabel} placeholder="Label" style={[styles.input, { color: colors.text }]} />
        <TextInput value={line1} onChangeText={setLine1} placeholder="Street address" style={[styles.input, { color: colors.text }]} />
        <AppButton label="Save address" onPress={handleSave} />
      </View>
      {!addresses.length ? (
        <EmptyState title="No saved addresses" description="Tap the map and save your first delivery address." />
      ) : (
        addresses.map((address) => (
          <View key={address.id} style={[styles.addressCard, { backgroundColor: colors.card }]}>
            <Text style={{ color: colors.text, fontWeight: '800' }}>{address.label}</Text>
            <Text style={{ color: colors.mutedText }}>{address.line1}</Text>
          </View>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  map: { width: '100%', height: 260, borderRadius: 22 },
  form: { borderRadius: 22, padding: 16, gap: 12 },
  input: { minHeight: 48, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', fontSize: 15 },
  addressCard: { borderRadius: 20, padding: 16, gap: 6 }
});
