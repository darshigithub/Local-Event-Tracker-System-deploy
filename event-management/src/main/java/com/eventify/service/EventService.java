package com.eventify.service;

import com.eventify.dto.event.EventRequest;
import com.eventify.dto.event.EventResponse;
import com.eventify.entity.Event;
import com.eventify.entity.User;
import com.eventify.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    
    public EventResponse createEvent(EventRequest request, User host) {

        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
        event.setGoogleMapUrl(request.getGoogleMapUrl());
        event.setEventDate(request.getEventDate());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setTotalSeats(request.getTotalSeats());
        event.setAvailableSeats(request.getTotalSeats());
        event.setPrice(request.getPrice());
        event.setBookingOpen(true);
        event.setHost(host);

        event = eventRepository.save(event);

        return mapToResponse(event, null);
    }

    
    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll()
                .stream()
                .map(event -> mapToResponse(event, null))
                .toList();
    }

   
    public EventResponse getEventById(Long eventId, Authentication authentication) {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        String loggedInUserEmail = null;

        if (authentication != null && authentication.isAuthenticated()) {
            loggedInUserEmail = authentication.getName();
        }

        return mapToResponse(event, loggedInUserEmail);
    }

    
    private EventResponse mapToResponse(Event event, String email) { 

        EventResponse response = new EventResponse();
        response.setId(event.getId());
        response.setTitle(event.getTitle());
        response.setDescription(event.getDescription());
        response.setLocation(event.getLocation());
        response.setGoogleMapUrl(event.getGoogleMapUrl());
        response.setEventDate(event.getEventDate());
        response.setStartTime(event.getStartTime());
        response.setEndTime(event.getEndTime());
        response.setTotalSeats(event.getTotalSeats());
        response.setAvailableSeats(event.getAvailableSeats());
        response.setPrice(event.getPrice());
        response.setBookingOpen(event.isBookingOpen());
        response.setHostName(
                event.getHost() != null ? event.getHost().getName() : "Unknown"
        );
        response.setLoggedInUserEmail(email); 

        return response;

    }
}
