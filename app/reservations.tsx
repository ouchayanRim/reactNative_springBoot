import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { Reservation, useReservations } from '@/contexts/ReservationContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import React from 'react';
import { Alert, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function ReservationsScreen() {
  const colorScheme = useColorScheme();
  const { logout } = useAuth();
  const { reservations, deleteReservation, loading } = useReservations();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const handleDelete = async (id: number) => {
    const result = await deleteReservation(id);
    if (!result.success && result.error) {
      Alert.alert('Error', result.error);
    }
  };

  const renderReservation = ({ item }: { item: Reservation }) => (
    <View style={[styles.reservationCard, { backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#F5F5F5' }]}>
      <View style={styles.reservationHeader}>
        <ThemedText style={styles.date}>{item.date}</ThemedText>
        <ThemedText style={styles.time}>{item.time}</ThemedText>
      </View>
      <View style={styles.reservationDetails}>
        <ThemedText style={styles.detail}>Duration: {item.duration} hour{item.duration !== 1 ? 's' : ''}</ThemedText>
        <ThemedText style={styles.detail}>Guests: {item.guestCount}</ThemedText>
      </View>
      <View style={styles.reservationActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton, { borderColor: Colors[colorScheme ?? 'light'].tint }]}
          onPress={() => router.push(`/edit-reservation?id=${item.id}`)}
        >
          <ThemedText style={[styles.actionText, { color: Colors[colorScheme ?? 'light'].tint }]}>Edit</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item.id)}
        >
          <ThemedText style={[styles.actionText, { color: '#FF4444' }]}>Delete</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>My Reservations</ThemedText>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <ThemedText style={[styles.logoutText, { color: Colors[colorScheme ?? 'light'].icon }]}>Logout</ThemedText>
        </TouchableOpacity>
      </View>

      {reservations.length === 0 ? (
        <View style={styles.emptyState}>
          <ThemedText style={styles.emptyText}>No reservations yet</ThemedText>
          <ThemedText style={styles.emptySubtext}>Create your first reservation below</ThemedText>
        </View>
      ) : (
        <FlatList
          data={[...reservations]}
          renderItem={renderReservation}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          extraData={reservations.length}
        />
      )}

      <View style={styles.footer}>
        <Button
          title="Add New Reservation"
          onPress={() => router.push('/add-reservation')}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    fontSize: 16,
  },
  list: {
    paddingBottom: 20,
  },
  reservationCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  reservationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  date: {
    fontSize: 18,
    fontWeight: '600',
  },
  time: {
    fontSize: 16,
    opacity: 0.8,
  },
  reservationDetails: {
    marginBottom: 12,
  },
  detail: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  reservationActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  editButton: {
    backgroundColor: 'transparent',
  },
  deleteButton: {
    backgroundColor: 'transparent',
    borderColor: '#FF4444',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.7,
  },
  footer: {
    paddingTop: 20,
  },
}); 