package com.eventify.controller;

import com.eventify.dto.event.EventRequest;
import com.eventify.dto.event.EventResponse;
import com.eventify.entity.User;
import com.eventify.service.EventService;
import com.eventify.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

        private final EventService eventService;
        private final UserService userService;

        @PostMapping
        public ResponseEntity<EventResponse> createEvent(
                        @RequestBody EventRequest request) {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication(); 

                String email = auth.getName();
                User host = userService.getByEmail(email);

                return ResponseEntity.ok(
                                eventService.createEvent(request, host));
        }

        @GetMapping
        public ResponseEntity<List<EventResponse>> getAllEvents() {
                return ResponseEntity.ok(eventService.getAllEvents());
        }

        @GetMapping("/{eventId}")
        public ResponseEntity<EventResponse> getEventById(
                        @PathVariable Long eventId,
                        Authentication authentication) {
                return ResponseEntity.ok(
                                eventService.getEventById(eventId, authentication));
        }
}
