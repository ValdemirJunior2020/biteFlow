// File: app/(public)/login.tsx
import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import { Link } from 'expo-router';
import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { Screen } from '@/components/Screen';
import { SectionTitle } from '@/components/SectionTitle';
import { useTheme } from '@/hooks/useTheme';
import { googleClientIds, loginWithEmail, loginWithFirebaseGoogleIdToken } from '@/services/auth';

export default function LoginScreen() {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [, response, promptAsync] = Google.useIdTokenAuthRequest({
    iosClientId: googleClientIds.iosClientId,
    androidClientId: googleClientIds.androidClientId,
    webClientId: googleClientIds.webClientId
  });

  useEffect(() => {
    if (response?.type === 'success' && response.params.id_token) {
      loginWithFirebaseGoogleIdToken(response.params.id_token).catch((error) => {
        Alert.alert('Google sign-in failed', error.message);
      });
    }
  }, [response]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await loginWithEmail(email, password);
    } catch (error: any) {
      Alert.alert('Login failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <SectionTitle title="Welcome back" subtitle="Login as customer, restaurant owner, or super admin." />
      <AppInput label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <AppInput label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <AppButton label="Login" onPress={handleLogin} loading={loading} />
      <AppButton label="Continue with Google" variant="ghost" onPress={() => promptAsync()} />

      <View style={styles.footer}>
        <Link href="/(public)/forgot-password" asChild>
          <Pressable>
            <Text style={[styles.link, { color: colors.primary }]}>Forgot password?</Text>
          </Pressable>
        </Link>
        <View style={styles.row}>
          <Text style={{ color: colors.mutedText }}>Need an account?</Text>
          <Link href="/(public)/signup" asChild>
            <Pressable>
              <Text style={[styles.link, { color: colors.primary }]}>Sign up</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  footer: { gap: 12, alignItems: 'center', marginTop: 8 },
  row: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  link: { fontSize: 15, fontWeight: '600' }
});
