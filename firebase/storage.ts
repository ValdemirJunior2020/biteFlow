// File: firebase/storage.ts
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/firebase/config';

export async function pickImageUri() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) throw new Error('Photo permission denied');

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 0.8,
    allowsEditing: true,
    aspect: [4, 3]
  });

  if (result.canceled) return null;
  return result.assets[0].uri;
}

export async function uploadImageAsync(uri: string, folder: string) {
  const response = await fetch(uri);
  const blob = await response.blob();
  const fileRef = ref(storage, `${folder}/${Date.now()}.jpg`);
  await uploadBytes(fileRef, blob, { contentType: 'image/jpeg' });
  return getDownloadURL(fileRef);
}
