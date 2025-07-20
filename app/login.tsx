import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

export default function LoginScreen() {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
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
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedView style={styles.container}>
          <View style={styles.content}>
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
              />

              <Button
                title="Sign In"
                onPress={handleLogin}
                loading={loading}
              />
            </View>

            <View style={styles.footer}>
              <ThemedText style={styles.footerText}>
                Don&apos;t have an account?{' '}
                <Link href="/signup" style={{ color: Colors.tint }}>
                  <ThemedText style={[styles.link, { color: Colors.tint }]}>
                    Sign Up
                  </ThemedText>
                </Link>
              </ThemedText>

              <View style={styles.backContainer}>
                <Link href="/" style={{ color: Colors.icon }}>
                  <ThemedText style={[styles.backText, { color: Colors.icon }]}>
                    ← Back to Home
                  </ThemedText>
                </Link>
              </View>
            </View>
          </View>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
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
  backContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  backText: {
    fontSize: 14,
  },
}); 