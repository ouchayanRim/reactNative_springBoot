import React, { createContext, ReactNode, useContext, useState } from 'react';

export interface Reservation {
  id: string;
  date: string;
  time: string;
  duration: number; // in hours
  guestCount: number;
  createdAt: string;
}

interface ReservationContextType {
  reservations: Reservation[];
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt'>) => void;
  updateReservation: (id: string, reservation: Omit<Reservation, 'id' | 'createdAt'>) => void;
  deleteReservation: (id: string) => void;
  getReservation: (id: string) => Reservation | undefined;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

interface ReservationProviderProps {
  children: ReactNode;
}

export function ReservationProvider({ children }: ReservationProviderProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const addReservation = (reservationData: Omit<Reservation, 'id' | 'createdAt'>) => {
    const newReservation: Reservation = {
      ...reservationData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setReservations(prev => [...prev, newReservation]);
  };

  const updateReservation = (id: string, reservationData: Omit<Reservation, 'id' | 'createdAt'>) => {
    setReservations(prev =>
      prev.map(reservation =>
        reservation.id === id
          ? { ...reservation, ...reservationData }
          : reservation
      )
    );
  };

  const deleteReservation = (id: string) => {
    setReservations(prev => prev.filter(reservation => reservation.id !== id));
  };

  const getReservation = (id: string) => {
    return reservations.find(reservation => reservation.id === id);
  };

  const value = {
    reservations,
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