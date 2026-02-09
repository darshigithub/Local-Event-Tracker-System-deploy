package com.eventify.service;

import com.eventify.dto.Booking.BookingRequest;
import com.eventify.dto.Booking.BookingResponse;
import com.eventify.entity.Booking;
import com.eventify.entity.Event;
import com.eventify.entity.User;
import com.eventify.repository.BookingRepository;
import com.eventify.repository.EventRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;
    private final UserService userService;

    
    @Transactional
    public BookingResponse bookEvent(BookingRequest request) {

        User user = userService.getCurrentUser();

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!event.isBookingOpen()) {
            throw new RuntimeException("Booking is closed for this event");
        }

        if (bookingRepository.existsByUserAndEvent(user, event)) {
            throw new RuntimeException("You have already booked this event");
        }

        int seatsRequested = request.getSeats();

        if (event.getAvailableSeats() < seatsRequested) {
            throw new RuntimeException("Not enough seats available");
        }

        
        event.setAvailableSeats(event.getAvailableSeats() - seatsRequested);

        if (event.getAvailableSeats() == 0) {
            event.setBookingOpen(false);
        }

        eventRepository.save(event);

        Booking booking = Booking.builder()
                .user(user)
                .event(event)
                .numberOfSeats(seatsRequested)
                .bookedAt(LocalDateTime.now())
                .build();

        bookingRepository.save(booking);

        return BookingResponse.builder()
                .bookingId(booking.getId())
                .eventTitle(event.getTitle())
                .location(event.getLocation())
                .seatsBooked(seatsRequested)
                .build();
    }

    // 👤 MY BOOKINGS
    public List<Booking> getMyBookings() {
        User user = userService.getCurrentUser();
        return bookingRepository.findByUser(user);
    }
}
