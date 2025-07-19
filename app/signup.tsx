import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

export default function SignupScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();

  const handleSignup = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      // In a real app, you'd show an error message
      return;
    }

    setLoading(true);
    // Simulate signup API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    
    // Navigate or handle success - for now just log
    console.log('Signup attempted with:', { username, email, password });
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>Create Account</ThemedText>
            <ThemedText style={styles.subtitle}>Sign up to get started</ThemedText>
          </View>

          <View style={styles.form}>
            <Input
              label="Username"
              value={username}
              onChangeText={setUsername}
              placeholder="Choose a username"
              autoCapitalize="none"
            />

            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              secureTextEntry
              autoCapitalize="none"
            />

            <Button
              title="Sign Up"
              onPress={handleSignup}
              loading={loading}
            />

            <View style={styles.footer}>
              <ThemedText style={styles.footerText}>
                Already have an account?{' '}
                <Link href="/login" style={{ color: Colors[colorScheme ?? 'light'].tint }}>
                  <ThemedText style={[styles.link, { color: Colors[colorScheme ?? 'light'].tint }]}>
                    Login
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