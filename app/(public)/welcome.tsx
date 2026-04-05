// C:\Users\Valdemir Goncalves\Desktop\pROJETUS-2026\BiteFlow-SaaS-Expo-Router-v3-fixed-icons\app\(public)\welcome.tsx
import { View, Text } from 'react-native';

export default function WelcomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24
      }}
    >
      <Text style={{ fontSize: 30, fontWeight: '800', color: '#111827' }}>BiteFlow</Text>
      <Text style={{ marginTop: 12, fontSize: 16, color: '#6b7280', textAlign: 'center' }}>
        Welcome screen is rendering correctly.
      </Text>
    </View>
  );
}