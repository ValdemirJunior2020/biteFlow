// File: app/(public)/signup.tsx
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { Screen } from '@/components/Screen';
import { SectionTitle } from '@/components/SectionTitle';
import { signupWithEmail } from '@/services/auth';
import { useTheme } from '@/hooks/useTheme';
import type { UserRole } from '@/types';

const roles: { label: string; value: UserRole }[] = [
  { label: 'Customer', value: 'customer' },
  { label: 'Restaurant owner', value: 'restaurant_owner' }
];

export default function SignupScreen() {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    try {
      setLoading(true);
      await signupWithEmail({ name, email, password, role });
      if (role === 'restaurant_owner') {
        router.replace('/(restaurant)/restaurant-profile');
      }
    } catch (error: any) {
      Alert.alert('Signup failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <SectionTitle title="Create your account" subtitle="Choose the role you want to start with." />
      <AppInput label="Full name" value={name} onChangeText={setName} />
      <AppInput label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <AppInput label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <View style={{ gap: 10 }}>
        <Text style={{ color: colors.text, fontWeight: '700' }}>Role</Text>
        <View style={styles.roles}>
          {roles.map((entry) => {
            const active = role === entry.value;
            return (
              <Pressable
                key={entry.value}
                onPress={() => setRole(entry.value)}
                style={[styles.roleCard, { backgroundColor: active ? colors.primary : colors.card, borderColor: colors.border }]}
              >
                <Text style={{ color: active ? '#fff' : colors.text, fontWeight: '700' }}>{entry.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <AppButton label="Create account" onPress={handleSignup} loading={loading} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  roles: { flexDirection: 'row', gap: 12 },
  roleCard: { flex: 1, borderWidth: 1, borderRadius: 16, minHeight: 54, alignItems: 'center', justifyContent: 'center' }
});
