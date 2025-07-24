import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { Link, router } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/reservations');
    }
  }, [isAuthenticated]);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText testID='welcome-index' style={styles.title}>Welcome</ThemedText>
        <ThemedText style={styles.subtitle}>Please choose an option to continue</ThemedText>
        
        <View style={styles.buttonContainer}>
          <Link href="/login" testID='login-button' style={[styles.button, { backgroundColor: Colors.tint }]}>
            <ThemedText style={styles.buttonText}>Login</ThemedText>
          </Link>
          
          <Link href="/signup" testID='signup-button' style={[styles.button, styles.secondaryButton, { borderColor: Colors.tint }]}>
            <ThemedText style={[styles.buttonText, { color: Colors.tint }]}>Sign Up</ThemedText>
          </Link>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
    opacity: 0.7,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    textDecorationLine: 'none',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 