package com.eventify.service;

import com.eventify.entity.User;
import com.eventify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    
    public User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User is not authenticated");
        }

        String email = authentication.getName(); 

        return getByEmail(email);
    }

    
    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found with email: " + email));
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId) 
                .orElseThrow(() ->
                        new RuntimeException("User not found with id: " + userId));
    }
}
