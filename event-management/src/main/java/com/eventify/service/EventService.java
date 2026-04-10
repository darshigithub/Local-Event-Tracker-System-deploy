package com.eventify.service;

import com.eventify.dto.event.*;
import com.eventify.entity.*;
import com.eventify.repository.EventParticipantRepository;
import com.eventify.repository.EventRepository;
import com.eventify.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EventParticipantRepository eventParticipantRepository;

    @Autowired
    private UserRepository userRepository;

    public EventResponse createEvent(EventRequest request, User host) {

        Event event = Event.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .location(request.getLocation())
                .googleMapUrl(request.getGoogleMapUrl())
                .eventDate(request.getEventDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .totalSeats(request.getTotalSeats())
                .availableSeats(request.getTotalSeats())
                .price(request.getPrice())
                .bookingOpen(true)
                .host(host)
                .build();

        eventRepository.save(event);

        // HOST
        saveParticipant(event, host, EventRole.HOST);

        // MEMBERS
        if (request.getParticipants() != null) {
            request.getParticipants().forEach(p -> {
                if (!p.getUserId().equals(host.getId())) {
                    User user = userRepository.findById(p.getUserId())
                            .orElseThrow(() -> new RuntimeException("User not found"));
                    saveParticipant(event, user, EventRole.MEMBER);
                }
            });
        }

        return mapToResponse(event, host);
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getAllEventsPublic() {

        List<Event> events = eventRepository.findAll();

        return events.stream()
                .map(this::mapToResponsePublic)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getAllEvents(User user) {

        List<Event> events = eventRepository.findAll();

        return events.stream()
                .map(event -> mapToResponse(event, user))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getEventsForUser(Long userId) {

        return eventParticipantRepository
                .findByUser_Id(userId)
                .stream()
                .map(EventParticipant::getEvent)
                .distinct()
                .map(event -> mapToResponse(event, null))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EventResponse getEventById(Long eventId, User user) {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        boolean hasAccess = eventParticipantRepository
                .existsByEvent_IdAndUser_Id(eventId, user.getId());

        if (!hasAccess) {
            throw new AccessDeniedException("You do not have access to this event");
        }

        return mapToResponse(event, user);
    }

    public void registerUser(Long eventId, User user) {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!event.isBookingOpen()) {
            throw new IllegalStateException("Booking is closed");
        }

        boolean alreadyRegistered = eventParticipantRepository
                .existsByEvent_IdAndUser_Id(eventId, user.getId());

        if (alreadyRegistered) {
            throw new IllegalStateException("Already registered");
        }

        if (event.getAvailableSeats() <= 0) {
            throw new IllegalStateException("No seats available");
        }

        saveParticipant(event, user, EventRole.MEMBER);

        event.setAvailableSeats(event.getAvailableSeats() - 1);
        eventRepository.save(event);
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getRegisteredEvents(Long userId) {

        return eventParticipantRepository.findByUser_Id(userId)
                .stream()
                .map(EventParticipant::getEvent)
                .distinct()
                .map(event -> mapToResponse(event, null))
                .collect(Collectors.toList());
    }

    private void saveParticipant(Event event, User user, EventRole role) {

        EventParticipant participant = EventParticipant.builder()
                .event(event)
                .user(user)
                .role(role)
                .addedAt(LocalDateTime.now())
                .build();

        eventParticipantRepository.save(participant);
    }

    private EventResponse mapToResponse(Event event, User loggedInUser) {

        List<EventUserResponse> participants = eventParticipantRepository
                .findByEvent_Id(event.getId())
                .stream()
                .map(p -> EventUserResponse.builder()
                        .userId(p.getUser().getId())
                        .name(p.getUser().getName())
                        .email(p.getUser().getEmail())
                        .role(p.getRole().name())
                        .build())
                .collect(Collectors.toList());

        boolean isHost = false;
        boolean isRegistered = false;

        if (loggedInUser != null) {
            isHost = event.getHost().getId().equals(loggedInUser.getId());

            isRegistered = eventParticipantRepository
                    .existsByEvent_IdAndUser_Id(event.getId(), loggedInUser.getId());
        }

        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .location(event.getLocation())
                .googleMapUrl(event.getGoogleMapUrl())
                .eventDate(event.getEventDate())
                .startTime(event.getStartTime())
                .endTime(event.getEndTime())
                .totalSeats(event.getTotalSeats())
                .availableSeats(event.getAvailableSeats())
                .price(event.getPrice())
                .bookingOpen(event.isBookingOpen())
                .hostName(event.getHost().getName())

                .isHost(isHost)
                .registered(isRegistered)
                .loggedInUserEmail(
                        loggedInUser != null ? loggedInUser.getEmail() : null)

                .participants(participants)
                .build();
    }

    @Transactional(readOnly = true)
    public EventStatsResponse getEventStats() {

        List<Event> events = eventRepository.findAll();

        int total = events.size();

        int active = (int) events.stream()
                .filter(e -> e.getEventDate().isAfter(java.time.LocalDate.now()))
                .count();

        int completed = (int) events.stream()
                .filter(e -> e.getEventDate().isBefore(java.time.LocalDate.now()))
                .count();

        return EventStatsResponse.builder()
                .totalEvents(total)
                .activeEvents(active)
                .completedEvents(completed)
                .build();
    }

    private EventResponse mapToResponsePublic(Event event) {

        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .location(event.getLocation())
                .googleMapUrl(event.getGoogleMapUrl())
                .eventDate(event.getEventDate())
                .startTime(event.getStartTime())
                .endTime(event.getEndTime())
                .totalSeats(event.getTotalSeats())
                .availableSeats(event.getAvailableSeats())
                .price(event.getPrice())
                .bookingOpen(event.isBookingOpen())
                .hostName(event.getHost().getName())
                .isHost(false)
                .registered(false)
                .loggedInUserEmail(null)
                .participants(null)
                .build();
    }
}