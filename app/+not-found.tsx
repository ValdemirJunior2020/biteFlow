// File: app/+not-found.tsx
import { Link } from 'expo-router';
import { Text } from 'react-native';
import { Screen } from '@/components/Screen';

export default function NotFound() {
  return (
    <Screen>
      <Text style={{ fontSize: 24, fontWeight: '800' }}>Screen not found.</Text>
      <Link href="/(public)/welcome">Go home</Link>
    </Screen>
  );
}
