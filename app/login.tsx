import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

export default function LoginScreen() {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!emailOrUsername.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await login(emailOrUsername, password);
    setLoading(false);
    
    if (result.success) {
      router.replace('/reservations');
    } else {
      Alert.alert('Login Failed', result.error || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>Welcome Back</ThemedText>
            <ThemedText style={styles.subtitle}>Sign in to your account</ThemedText>
          </View>

          <View style={styles.form}>
            <Input
              label="Email or Username"
              value={emailOrUsername}
              onChangeText={setEmailOrUsername}
              placeholder="Enter your email or username"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              autoCapitalize="none"
            />

            <Button
              title="Login"
              onPress={handleLogin}
              loading={loading}
            />

            <View style={styles.footer}>
              <ThemedText style={styles.footerText}>
                Don&apos;t have an account?{' '}
                <Link href="/signup" style={{ color: Colors[colorScheme ?? 'light'].tint }}>
                  <ThemedText style={[styles.link, { color: Colors[colorScheme ?? 'light'].tint }]}>
                    Sign up
                  </ThemedText>
                </Link>
              </ThemedText>
            </View>

            <View style={styles.backButton}>
              <Link href="/" style={{ color: Colors[colorScheme ?? 'light'].icon }}>
                <ThemedText style={[styles.backText, { color: Colors[colorScheme ?? 'light'].icon }]}>
                  ← Back to Home
                </ThemedText>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
  },
  link: {
    fontWeight: '600',
  },
  backButton: {
    alignItems: 'center',
    marginTop: 30,
  },
  backText: {
    fontSize: 14,
  },
}); 