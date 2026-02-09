package com.eventify.service;

import com.eventify.dto.profile.*;
import com.eventify.entity.*;
import com.eventify.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;

    public ProfileResponse getProfile(String email) {

        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        ProfileResponse response = new ProfileResponse();
        response.setName(user.getName());
        response.setEmail(user.getEmail());

        
        List<BookedEventDTO> bookedEvents;

        List<Booking> bookings = bookingRepository.findByUser(user);
        if (bookings == null || bookings.isEmpty()) {
            bookedEvents = Collections.emptyList();
        } else {
            bookedEvents = bookings.stream()
                    .map(booking -> {
                        Event event = booking.getEvent();

                        BookedEventDTO dto = new BookedEventDTO();
                        dto.setEventId(event.getId());
                        dto.setTitle(event.getTitle());
                        dto.setLocation(event.getLocation());
                        return dto;
                    })
                    .collect(Collectors.toList());
        }

        response.setBookedEvents(bookedEvents);

        
        List<HostedEventDTO> hostedEvents;

        List<Event> events = eventRepository.findByHost(user);
        if (events == null || events.isEmpty()) {
            hostedEvents = Collections.emptyList();
        } else {
            hostedEvents = events.stream()
                    .map(event -> {
                        HostedEventDTO dto = new HostedEventDTO();
                        dto.setEventId(event.getId());
                        dto.setTitle(event.getTitle());
                        dto.setBookingOpen(event.isBookingOpen());
                        return dto;
                    })
                    .collect(Collectors.toList());
        }

        response.setHostedEvents(hostedEvents);

        return response;
    }
}
