import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { Link, router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';

export default function SignupScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  // Références pour les tests
  const usernameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const handleSignup = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    console.log('Attempting registration with:', { username, email }); // Debug
    const result = await register(username, email, password);
    setLoading(false);

    if (result.success) {
      router.replace('/login');
    } else {
      Alert.alert('Error', result.error || 'Registration failed');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      testID="signup-screen"
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedView style={styles.container}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <ThemedText style={styles.title} testID="button-signup">Create Account</ThemedText>
              <ThemedText style={styles.subtitle}>Sign up to get started</ThemedText>
            </View>

            {/* Formulaire */}
            <View style={styles.form}>
              <Input
                ref={usernameRef}
                label="Username"
                value={username}
                onChangeText={setUsername}
                placeholder="Choose a username"
                autoCapitalize="none"
                testID="input-username"
                accessibilityLabel="Username input field"
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
              />

              <Input
                ref={emailRef}
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                testID="input-email"
                accessibilityLabel="Email input field"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
              />

              <Input
                ref={passwordRef}
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Choose a password"
                secureTextEntry
                testID="input-password"
                accessibilityLabel="Password input field"
                returnKeyType="done"
              />

              <Button
                title={loading ? "Creating Account..." : "Create Account"}
                onPress={handleSignup}
                loading={loading}
                testID="button-signup"
                accessibilityLabel="Create account button"
              />
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <ThemedText style={styles.footerText}>
                Already have an account?{' '}
                <Link 
                  href="/login" 
                  style={{ color: Colors.tint }} 
                  testID="link-signin"
                  accessibilityLabel="Sign in link"
                >
                  <ThemedText style={[styles.link, { color: Colors.tint }]}>
                    Sign In
                  </ThemedText>
                </Link>
              </ThemedText>

              <View style={styles.backContainer}>
                <Link 
                  href="/" 
                  style={{ color: Colors.icon }} 
                  testID="link-back-home"
                  accessibilityLabel="Back to home link"
                >
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
  container: { flex: 1 },
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
    gap: 16, // Espacement entre les champs
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