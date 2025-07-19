import { reservationAPI } from '@/utils/api';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

export interface Reservation {
  id: number;
  userId: number;
  date: string;
  time: string;
  duration: number;
  guestCount: number;
  createdAt: string;
}

interface ReservationContextType {
  reservations: Reservation[];
  loading: boolean;
  loadReservations: () => Promise<void>;
  addReservation: (reservation: { date: string; time: string; duration: number; guestCount: number }) => Promise<{ success: boolean; error?: string }>;
  updateReservation: (id: number, reservation: Partial<{ date: string; time: string; duration: number; guestCount: number }>) => Promise<{ success: boolean; error?: string }>;
  deleteReservation: (id: number) => Promise<{ success: boolean; error?: string }>;
  getReservation: (id: number) => Reservation | undefined;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

interface ReservationProviderProps {
  children: ReactNode;
}

export function ReservationProvider({ children }: ReservationProviderProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const loadReservations = async () => {
    if (!user?.userId) return;
    
    setLoading(true);
    const response = await reservationAPI.getAll(user.userId);
    setLoading(false);
    
    if (response.data) {
      setReservations(response.data);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.userId) {
      loadReservations();
    } else {
      setReservations([]);
    }
  }, [isAuthenticated, user?.userId]);

  const addReservation = async (reservationData: { date: string; time: string; duration: number; guestCount: number }): Promise<{ success: boolean; error?: string }> => {
    if (!user?.userId) {
      return { success: false, error: 'User not authenticated' };
    }

    const response = await reservationAPI.create(user.userId, reservationData);
    
    if (response.error) {
      return { success: false, error: response.error };
    }

    if (response.data) {
      setReservations(prev => [...prev, response.data!]);
      return { success: true };
    }

    return { success: false, error: 'Unknown error occurred' };
  };

  const updateReservation = async (id: number, reservationData: Partial<{ date: string; time: string; duration: number; guestCount: number }>): Promise<{ success: boolean; error?: string }> => {
    const response = await reservationAPI.update(id, reservationData);
    
    if (response.error) {
      return { success: false, error: response.error };
    }

    if (response.data) {
      setReservations(prev =>
        prev.map(reservation =>
          reservation.id === id ? response.data! : reservation
        )
      );
      return { success: true };
    }

    return { success: false, error: 'Unknown error occurred' };
  };

  const deleteReservation = async (id: number): Promise<{ success: boolean; error?: string }> => {
    const response = await reservationAPI.delete(id);
    
    if (response.error) {
      return { success: false, error: response.error };
    }

    setReservations(prev => prev.filter(reservation => reservation.id !== id));
    return { success: true };
  };

  const getReservation = (id: number) => {
    return reservations.find(reservation => reservation.id === id);
  };

  const value = {
    reservations,
    loading,
    loadReservations,
    addReservation,
    updateReservation,
    deleteReservation,
    getReservation,
  };

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  );
}

export function useReservations() {
  const context = useContext(ReservationContext);
  if (context === undefined) {
    throw new Error('useReservations must be used within a ReservationProvider');
  }
  return context;
} 