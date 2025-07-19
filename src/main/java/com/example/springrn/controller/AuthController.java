package com.example.springrn.controller;

import com.example.springrn.entity.User;
import com.example.springrn.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");
        
        Optional<User> user = userRepository.findByUsername(username);
        
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("userId", user.get().getId());
            response.put("username", user.get().getUsername());
            return ResponseEntity.ok(response);
        }
        
        return ResponseEntity.badRequest().body(Map.of("error", "Invalid credentials"));
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> registerRequest) {
        String username = registerRequest.get("username");
        String email = registerRequest.get("email");
        String password = registerRequest.get("password");
        
        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));
        }
        
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
        }
        
        User newUser = new User(username, email, password);
        User savedUser = userRepository.save(newUser);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Registration successful");
        response.put("userId", savedUser.getId());
        response.put("username", savedUser.getUsername());
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of("message", "Logout successful"));
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestParam Long userId) {
        Optional<User> user = userRepository.findById(userId);
        
        if (user.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.get().getId());
            response.put("username", user.get().getUsername());
            response.put("email", user.get().getEmail());
            return ResponseEntity.ok(response);
        }
        
        return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
    }
} 