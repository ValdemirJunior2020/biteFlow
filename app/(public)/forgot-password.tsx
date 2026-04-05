// File: app/(public)/forgot-password.tsx
import { useState } from 'react';
import { Alert } from 'react-native';
import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { Screen } from '@/components/Screen';
import { SectionTitle } from '@/components/SectionTitle';
import { forgotPassword } from '@/services/auth';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    try {
      setLoading(true);
      await forgotPassword(email);
      Alert.alert('Check your email', 'We sent a password reset email.');
    } catch (error: any) {
      Alert.alert('Reset failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <SectionTitle title="Reset password" subtitle="Enter your email and we will send a reset link." />
      <AppInput label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <AppButton label="Send reset email" onPress={handleReset} loading={loading} />
    </Screen>
  );
}
