package com.example.springrn.controller;

import com.example.springrn.entity.Reservation;
import com.example.springrn.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {
    
    @Autowired
    private ReservationRepository reservationRepository;
    
    @GetMapping
    public ResponseEntity<List<Reservation>> getAllReservations(@RequestParam Long userId) {
        List<Reservation> reservations = reservationRepository.findByUserId(userId);
        return ResponseEntity.ok(reservations);
    }
    
    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody Map<String, Object> reservationRequest) {
        try {
            Long userId = Long.valueOf(reservationRequest.get("userId").toString());
            LocalDate date = LocalDate.parse(reservationRequest.get("date").toString());
            LocalTime time = LocalTime.parse(reservationRequest.get("time").toString());
            Integer duration = Integer.valueOf(reservationRequest.get("duration").toString());
            Integer guestCount = Integer.valueOf(reservationRequest.get("guestCount").toString());
            
            Reservation reservation = new Reservation(userId, date, time, duration, guestCount);
            Reservation savedReservation = reservationRepository.save(reservation);
            
            return ResponseEntity.ok(savedReservation);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid reservation data"));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getReservationById(@PathVariable Long id) {
        Optional<Reservation> reservation = reservationRepository.findById(id);
        
        if (reservation.isPresent()) {
            return ResponseEntity.ok(reservation.get());
        }
        
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateReservation(@PathVariable Long id, @RequestBody Map<String, Object> reservationRequest) {
        Optional<Reservation> existingReservation = reservationRepository.findById(id);
        
        if (!existingReservation.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        try {
            Reservation reservation = existingReservation.get();
            
            if (reservationRequest.containsKey("date")) {
                reservation.setDate(LocalDate.parse(reservationRequest.get("date").toString()));
            }
            if (reservationRequest.containsKey("time")) {
                reservation.setTime(LocalTime.parse(reservationRequest.get("time").toString()));
            }
            if (reservationRequest.containsKey("duration")) {
                reservation.setDuration(Integer.valueOf(reservationRequest.get("duration").toString()));
            }
            if (reservationRequest.containsKey("guestCount")) {
                reservation.setGuestCount(Integer.valueOf(reservationRequest.get("guestCount").toString()));
            }
            
            Reservation updatedReservation = reservationRepository.save(reservation);
            return ResponseEntity.ok(updatedReservation);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid reservation data"));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReservation(@PathVariable Long id) {
        if (!reservationRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        reservationRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Reservation deleted successfully"));
    }
} 