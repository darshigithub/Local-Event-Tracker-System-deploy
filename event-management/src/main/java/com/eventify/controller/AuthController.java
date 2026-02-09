package com.eventify.controller;

import com.eventify.dto.auth.AuthResponse;
import com.eventify.dto.auth.LoginRequest;
import com.eventify.dto.auth.RegisterRequest;
import com.eventify.entity.User;
import com.eventify.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController { 

    private final AuthService authService;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        authService.register(request);
        return "User registered successfully";
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {

        User user = authService.authenticate(request);
        String token = authService.generateToken(user);

        return new AuthResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getName()
        );
    }
}
