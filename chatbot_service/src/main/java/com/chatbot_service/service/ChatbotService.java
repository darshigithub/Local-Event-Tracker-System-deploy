package com.chatbot_service.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;

@Service
public class ChatbotService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public ChatbotService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    private final String EVENT_API = "http://localhost:8080/api/events";
    private final String AUTH_API = "http://localhost:8080/api/auth";
    private final String BOOKING_API = "http://localhost:8080/api/bookings";
    private final String REVIEW_API = "http://localhost:8080/api/reviews";

    public String processMessage(String message, String token) {

        System.out.println("Message: " + message);
        System.out.println("Token: " + token);

        message = message.trim().toLowerCase();

        try {

            // GREETING
            if (message.equals("hi") || message.equals("hello")) {
                return "Hello! I can help you with events, login, booking & analytics.";
            }

            // LOGIN FIXED (RETURNS JSON)
            if (message.startsWith("login")) {

                String[] parts = message.split(" ");
                if (parts.length < 3)
                    return "Use: login email password";

                String body = String.format(
                        "{\"email\":\"%s\",\"password\":\"%s\"}",
                        parts[1], parts[2]);

                ResponseEntity<String> response = restTemplate.postForEntity(
                        AUTH_API + "/login",
                        new HttpEntity<>(body, jsonHeaders()),
                        String.class);

                // RETURN JSON DIRECTLY (IMPORTANT)
                return "Login successful! Token: " + response.getBody();
            }

            // REGISTER USER
            if (message.startsWith("register user")) {
                String[] parts = message.split(" ");
                if (parts.length < 5)
                    return "Use: register user name email password";

                String json = String.format(
                        "{\"name\":\"%s\",\"email\":\"%s\",\"password\":\"%s\"}",
                        parts[2], parts[3], parts[4]);

                restTemplate.postForEntity(
                        AUTH_API + "/register",
                        new HttpEntity<>(json, jsonHeaders()),
                        String.class);

                return "User registered successfully!";
            }

            // PUBLIC EVENTS
            if (message.contains("events") && !message.contains("my")) {
                return formatEventNames(
                        restTemplate.getForObject(EVENT_API, String.class));
            }

            // MY EVENTS
            if (message.contains("my events")) {
                checkAuth(token);

                ResponseEntity<String> response = restTemplate.exchange(
                        EVENT_API + "/my",
                        HttpMethod.GET,
                        new HttpEntity<>(authHeaders(token)),
                        String.class);

                return formatEventNames(response.getBody());
            }

            // BOOK EVENT
            if (message.toLowerCase().startsWith("book event")) {

                checkAuth(token); // Ensure JWT exists

                try {
                    String[] parts = message.replace("book event", "")
                            .trim()
                            .split("\\|");

                    if (parts.length < 2) {
                        return "Use: book event eventId|seats\nExample: book event 1|2";
                    }

                    Long eventId = Long.parseLong(parts[0].trim());
                    int seats = Integer.parseInt(parts[1].trim());

                    // Optional inventory
                    Long inventoryItemId = null;
                    int inventoryQty = 0;

                    if (parts.length >= 4) {
                        inventoryItemId = Long.parseLong(parts[2].trim());
                        inventoryQty = Integer.parseInt(parts[3].trim());
                    }

                    // Build JSON request
                    String json = String.format(
                            "{ \"eventId\": %d, \"seats\": %d, \"inventoryItemId\": %s, \"inventoryQuantity\": %d }",
                            eventId,
                            seats,
                            inventoryItemId != null ? inventoryItemId : "null",
                            inventoryQty);

                    // Call Booking API
                    ResponseEntity<String> response = restTemplate.exchange(
                            BOOKING_API,
                            HttpMethod.POST,
                            new HttpEntity<>(json, authHeaders(token)),
                            String.class);

                    return "Booking successful!" + response.getBody();

                } catch (NumberFormatException e) {
                    return "Invalid input. Use numbers only.\nExample: book event 1|2";
                } catch (HttpClientErrorException e) {
                    return "Booking failed: " + e.getResponseBodyAsString();
                } catch (Exception e) {
                    return "Something went wrong while booking.";
                }
            }

            // ADD REVIEW
            if (message.startsWith("add review")) {
                checkAuth(token);

                String[] parts = message.replace("add review", "").trim().split("\\|");

                if (parts.length < 3)
                    return "Use: add review eventId|rating|comment";

                Long eventId = Long.parseLong(parts[0]);
                int rating = Integer.parseInt(parts[1]);
                String comment = parts[2];

                if (rating < 1 || rating > 5)
                    return "Rating must be between 1-5";

                String json = String.format(
                        "{ \"eventId\": %d, \"rating\": %d, \"comment\": \"%s\" }",
                        eventId, rating, comment);

                System.out.println("Review JSON: " + json);
                System.out.println("Token used: " + token);

                restTemplate.postForEntity(
                        REVIEW_API,
                        new HttpEntity<>(json, authHeaders(token)),
                        String.class);

                return "Review added successfully!";
            }

            // STATS
            if (message.contains("stats") || message.contains("analytics")) {
                return getEventStats();
            }

        } catch (HttpClientErrorException.Forbidden e) {
            return "Access Denied! Complete booking before review.";
        } catch (HttpClientErrorException e) {
            return "HTTP Error: " + e.getStatusCode();
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }

        return """
                Commands:
                - login email password
                - register user name email password
                - events
                - book event 1|2
                - add review 1|5|Great event
                """;
    }

    private void checkAuth(String token) {
        if (token == null || token.isEmpty() || token.equals("null")) {
            throw new RuntimeException("Please login first.");
        }
    }

    private HttpHeaders jsonHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    private HttpHeaders authHeaders(String token) {
        HttpHeaders headers = jsonHeaders();
        headers.set("Authorization", "Bearer " + token);
        return headers;
    }

    private String getEventStats() {
        try {
            JsonNode array = objectMapper.readTree(
                    restTemplate.getForObject(EVENT_API, String.class));

            int total = array.size();
            int active = 0;
            int finished = 0;

            for (JsonNode node : array) {
                if (LocalDate.parse(node.get("eventDate").asText())
                        .isAfter(LocalDate.now())) {
                    active++;
                } else {
                    finished++;
                }
            }

            return """
                    Event Stats:
                    Total: %d
                    Active: %d
                    Finished: %d
                    """.formatted(total, active, finished); 

        } catch (Exception e) {
            return "Error calculating stats.";
        }
    }

    private String formatEventNames(String json) {
        try {
            JsonNode array = objectMapper.readTree(json);

            StringBuilder result = new StringBuilder("Events:\n");

            for (JsonNode node : array) {
                result.append("• ")
                        .append(node.get("title").asText())
                        .append(" (ID: ")
                        .append(node.get("id").asInt())
                        .append(")\n");
            }

            return result.toString();

        } catch (Exception e) {
            return "Error formatting events.";
        }
    }
}