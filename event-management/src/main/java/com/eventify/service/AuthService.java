package com.eventify.service;

import com.eventify.config.JwtUtil;
import com.eventify.dto.auth.LoginRequest;
import com.eventify.dto.auth.RegisterRequest;
import com.eventify.entity.User;
import com.eventify.repository.UserRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // REGISTER USER
    public void register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);
    }

    // LOGIN AUTHENTICATION
    public User authenticate(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return user;
    }

    // JWT TOKEN GENERATION
    public String generateToken(User user) {
        return jwtUtil.generateToken(user.getEmail());
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
