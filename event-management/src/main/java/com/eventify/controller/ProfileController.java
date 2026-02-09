package com.eventify.controller;

import com.eventify.dto.profile.ProfileResponse;
import com.eventify.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    public ProfileResponse getProfile(Authentication authentication) {

        if (authentication == null) {
            throw new RuntimeException("Unauthorized");
        }

        String email = authentication.getName(); 
        return profileService.getProfile(email);
    }
}
