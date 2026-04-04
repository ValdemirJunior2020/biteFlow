// File: app/(public)/login.tsx
import { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import { Link } from 'expo-router';
import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { Screen } from '@/components/Screen';
import { SectionTitle } from '@/components/SectionTitle';
import { googleClientIds, loginWithEmail, loginWithFirebaseGoogleIdToken } from '@/firebase/auth';

export default function LoginScreen() {
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
      <Link href="/(public)/forgot-password">Forgot password?</Link>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        <Text>Need an account?</Text>
        <Link href="/(public)/signup">Sign up</Link>
      </View>
    </Screen>
  );
}
