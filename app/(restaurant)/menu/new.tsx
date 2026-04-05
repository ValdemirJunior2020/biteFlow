// File: app/(restaurant)/menu/new.tsx
import { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { Screen } from '@/components/Screen';
import { SectionTitle } from '@/components/SectionTitle';
import { getRestaurantsByOwner, saveMenuItem } from '@/services/firestore';
import { pickImageUri, uploadImageAsync } from '@/services/storage';
import { useAuthStore } from '@/store/auth-store';

export default function NewMenuItemScreen() {
  const profile = useAuthStore((s) => s.profile);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('0');
  const [category, setCategory] = useState('Main');
  const [imageURL, setImageURL] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImage = async () => {
    try {
      const uri = await pickImageUri();
      if (!uri) return;
      const url = await uploadImageAsync(uri, 'menu-items');
      setImageURL(url);
    } catch (error: any) {
      Alert.alert('Upload failed', error.message);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    const restaurants = await getRestaurantsByOwner(profile.id);
    if (!restaurants[0]) return Alert.alert('Missing restaurant', 'Create your restaurant profile first.');

    try {
      setLoading(true);
      await saveMenuItem({
        restaurantId: restaurants[0].id,
        name,
        description,
        price: Number(price),
        category,
        imageURL,
        isAvailable: true,
        customizationGroups: []
      });
      Alert.alert('Saved', 'Menu item created.');
      router.back();
    } catch (error: any) {
      Alert.alert('Save failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <SectionTitle title="New menu item" subtitle="Products with price, category, images, and customizations." />
      <AppInput label="Name" value={name} onChangeText={setName} />
      <AppInput label="Description" value={description} onChangeText={setDescription} />
      <AppInput label="Price" value={price} onChangeText={setPrice} keyboardType="decimal-pad" />
      <AppInput label="Category" value={category} onChangeText={setCategory} />
      <AppButton label="Upload image" variant="ghost" onPress={handleImage} />
      <AppButton label="Save menu item" onPress={handleSave} loading={loading} />
    </Screen>
  );
}
