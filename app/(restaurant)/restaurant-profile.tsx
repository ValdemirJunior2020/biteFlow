// File: app/(restaurant)/restaurant-profile.tsx
import { useEffect, useState } from 'react';
import { Alert, Text } from 'react-native';
import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { Screen } from '@/components/Screen';
import { SectionTitle } from '@/components/SectionTitle';
import { getRestaurantsByOwner, saveRestaurant } from '@/services/firestore';
import { pickImageUri, uploadImageAsync } from '@/services/storage';
import { useAuthStore } from '@/store/auth-store';
import type { Restaurant } from '@/types';

export default function RestaurantProfileScreen() {
  const profile = useAuthStore((s) => s.profile);
  const [existing, setExisting] = useState<Restaurant | null>(null);
  const [name, setName] = useState('');
  const [cuisine, setCuisine] = useState('Pizza');
  const [description, setDescription] = useState('Fast delivery and premium dishes.');
  const [address, setAddress] = useState('1915 N A St, Lake Worth Beach, FL 33460');
  const [latitude, setLatitude] = useState('26.6379');
  const [longitude, setLongitude] = useState('-80.0684');
  const [logoURL, setLogoURL] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!profile) return;
    getRestaurantsByOwner(profile.id).then((list) => {
      const first = list[0] || null;
      setExisting(first);
      if (first) {
        setName(first.name);
        setCuisine(first.cuisine);
        setDescription(first.description);
        setAddress(first.location.address);
        setLatitude(String(first.location.latitude));
        setLongitude(String(first.location.longitude));
        setLogoURL(first.logoURL || '');
      }
    });
  }, [profile]);

  const handleLogo = async () => {
    try {
      const uri = await pickImageUri();
      if (!uri) return;
      const url = await uploadImageAsync(uri, 'restaurants/logos');
      setLogoURL(url);
      Alert.alert('Uploaded', 'Restaurant logo uploaded.');
    } catch (error: any) {
      Alert.alert('Upload failed', error.message);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    try {
      setLoading(true);
      await saveRestaurant({
        ownerId: profile.id,
        name,
        cuisine,
        description,
        logoURL,
        location: {
          address,
          latitude: Number(latitude),
          longitude: Number(longitude)
        }
      }, existing?.id);
      Alert.alert('Saved', 'Restaurant profile updated.');
    } catch (error: any) {
      Alert.alert('Save failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <SectionTitle title="Restaurant profile" subtitle="Owners can create and manage their own restaurant tenant." />
      <AppInput label="Restaurant name" value={name} onChangeText={setName} />
      <AppInput label="Cuisine" value={cuisine} onChangeText={setCuisine} />
      <AppInput label="Description" value={description} onChangeText={setDescription} multiline />
      <AppInput label="Address" value={address} onChangeText={setAddress} />
      <AppInput label="Latitude" value={latitude} onChangeText={setLatitude} />
      <AppInput label="Longitude" value={longitude} onChangeText={setLongitude} />
      <Text>Logo URL: {logoURL || 'Not uploaded yet'}</Text>
      <AppButton label="Upload logo" variant="ghost" onPress={handleLogo} />
      <AppButton label="Save restaurant" onPress={handleSave} loading={loading} />
    </Screen>
  );
}
