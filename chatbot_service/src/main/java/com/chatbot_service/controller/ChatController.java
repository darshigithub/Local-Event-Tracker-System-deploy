package com.chatbot_service.controller;

import com.chatbot_service.dto.ChatRequest;
import com.chatbot_service.service.ChatbotService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/chat")
@CrossOrigin(origins = "http://localhost:3000") // Allow requests from React frontend
public class ChatController {

    private final ChatbotService chatbotService;

    public ChatController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping
    public ResponseEntity<?> chat(
            @RequestBody ChatRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        try {
            
            String token = extractToken(authHeader);

            // Debug (you can remove later)
            System.out.println("Incoming message: " + request.getMessage());
            System.out.println("Raw header: " + authHeader);
            System.out.println("Extracted token: " + token);

            String response = chatbotService.processMessage(
                    request.getMessage(),
                    token
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Error: " + e.getMessage());
        }
    }

    
    private String extractToken(String authHeader) {

        if (authHeader == null || authHeader.isBlank()) {
            return null;
        }

        // Correct format: "Bearer token"
        if (authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7).trim();
        }

        // fallback if token sent directly
        return authHeader.trim();
    }
}