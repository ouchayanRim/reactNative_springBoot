import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useReservations } from '@/contexts/ReservationContext';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

export default function EditReservationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [loading, setLoading] = useState(false);
  const { getReservation, updateReservation } = useReservations();

  useEffect(() => {
    if (id) {
      const reservation = getReservation(parseInt(id));
      if (reservation) {
        setDate(reservation.date);
        setTime(reservation.time);
        setDuration(reservation.duration.toString());
        setGuestCount(reservation.guestCount.toString());
      } else {
        Alert.alert('Error', 'Reservation not found', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
    }
  }, [id]);

  const handleSubmit = async () => {
    if (!date.trim() || !time.trim() || !duration.trim() || !guestCount.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const durationNum = parseInt(duration);
    const guestCountNum = parseInt(guestCount);

    if (isNaN(durationNum) || durationNum <= 0) {
      Alert.alert('Error', 'Duration must be a positive number');
      return;
    }

    if (isNaN(guestCountNum) || guestCountNum <= 0) {
      Alert.alert('Error', 'Guest count must be a positive number');
      return;
    }

    if (!id) {
      Alert.alert('Error', 'Invalid reservation ID');
      return;
    }

    setLoading(true);
    const result = await updateReservation(parseInt(id), {
      date,
      time,
      duration: durationNum,
      guestCount: guestCountNum,
    });
    setLoading(false);

    if (result.success) {
      router.back();
    } else {
      Alert.alert('Error', result.error || 'Failed to update reservation');
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
            <ThemedText style={styles.title}>Edit Reservation</ThemedText>
            <ThemedText style={styles.subtitle}>Update the details below</ThemedText>
          </View>

          <View style={styles.form}>
            <Input
              label="Date"
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
            />

            <Input
              label="Time"
              value={time}
              onChangeText={setTime}
              placeholder="HH:MM"
            />

            <Input
              label="Duration (hours)"
              value={duration}
              onChangeText={setDuration}
              placeholder="Enter duration in hours"
              keyboardType="default"
            />

            <Input
              label="Guest Count"
              value={guestCount}
              onChangeText={setGuestCount}
              placeholder="Number of guests"
              keyboardType="default"
            />

            <Button
              title="Update Reservation"
              onPress={handleSubmit}
              loading={loading}
            />

            <Button
              title="Cancel"
              onPress={() => router.back()}
              variant="secondary"
            />
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
    paddingTop: 60,
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
}); 