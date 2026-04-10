package com.eventify.controller;

import com.eventify.dto.auth.AuthResponse;
import com.eventify.dto.auth.LoginRequest;
import com.eventify.dto.auth.RegisterRequest;
import com.eventify.entity.User;
import com.eventify.service.AuthService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        authService.register(request);
        return "User registered successfully"; 
    }

    // Login endpoint non rest api, returns token and user details
    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {

        User user = authService.authenticate(request);
        String token = authService.generateToken(user);

        System.out.println("User " + user.getEmail() + " logged in, token: " + token);

        return new AuthResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getName()
        );
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }
    
}