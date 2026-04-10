package com.eventify.controller;

import com.eventify.dto.event.EventRequest;
import com.eventify.dto.event.EventResponse;
import com.eventify.dto.event.EventStatsResponse;
import com.eventify.entity.User;
import com.eventify.service.EventService;
import com.eventify.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

        @Autowired
        private EventService eventService;

        @Autowired
        private UserService userService;

        // CREATE EVENT (HOST ONLY)
        @PostMapping
        public ResponseEntity<EventResponse> createEvent(
                        @RequestBody EventRequest request,
                        Authentication authentication) {


                String email = authentication.getName();
                User host = userService.getByEmail(email);

                return ResponseEntity.ok(
                                eventService.createEvent(request, host));
        }

        // GET EVENTS HOSTED BY LOGGED-IN USER
        @GetMapping("/my")
        public ResponseEntity<List<EventResponse>> getMyEvents(
                        Authentication authentication) {

                String email = authentication.getName();
                User user = userService.getByEmail(email);

                return ResponseEntity.ok(
                                eventService.getEventsForUser(user.getId()));
        }

        // GET EVENT BY ID (WITH USER CONTEXT)
        @GetMapping("/{eventId}")
        public ResponseEntity<EventResponse> getEventById(
                        @PathVariable Long eventId,
                        Authentication authentication) {

                String email = authentication.getName();
                User user = userService.getByEmail(email);

                return ResponseEntity.ok(
                                eventService.getEventById(eventId, user));
        }

        // REGISTER FOR EVENT
        @PostMapping("/{eventId}/register")
        public ResponseEntity<String> registerForEvent(
                        @PathVariable Long eventId,
                        Authentication authentication) {

                String email = authentication.getName();
                User user = userService.getByEmail(email);

                eventService.registerUser(eventId, user);

                return ResponseEntity.ok("Successfully registered for the event");
        }

        // GET EVENTS USER REGISTERED FOR
        @GetMapping("/registered")
        public ResponseEntity<List<EventResponse>> getRegisteredEvents(
                        Authentication authentication) {

                String email = authentication.getName();
                User user = userService.getByEmail(email);

                return ResponseEntity.ok(
                                eventService.getRegisteredEvents(user.getId()));
        }

        // GET ALL EVENTS (FOR DASHBOARD)
        @GetMapping
        public ResponseEntity<List<EventResponse>> getAllEvents() {

                return ResponseEntity.ok(
                                eventService.getAllEventsPublic());
        }

        // GET EVENT STATS
        @GetMapping("/stats")
        public ResponseEntity<EventStatsResponse> getStats() {
                return ResponseEntity.ok(eventService.getEventStats());
        } 
        
}
