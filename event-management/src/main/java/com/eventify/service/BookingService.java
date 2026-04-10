package com.eventify.service;

import com.eventify.client.InventoryClient;
import com.eventify.dto.Booking.BookingRequest;
import com.eventify.dto.Booking.BookingResponse;
import com.eventify.entity.*;
import com.eventify.repository.BookingRepository;
import com.eventify.repository.EventParticipantRepository;
import com.eventify.repository.EventRepository;
import com.eventify.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

        @Autowired
        private BookingRepository bookingRepository;

        @Autowired
        private EventRepository eventRepository;

        @Autowired
        private EventParticipantRepository eventParticipantRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private InventoryClient inventoryClient; // NEW

        @Transactional // ensures all operations are atomic and consistent
        public BookingResponse bookEvent(
                        BookingRequest request,
                        Authentication authentication) {

                // Logged-in user email from JWT
                String email = authentication.getName();

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Event event = eventRepository.findById(request.getEventId())
                                .orElseThrow(() -> new RuntimeException("Event not found"));

                // Access check
                boolean isAllowed = eventParticipantRepository
                                .existsByEvent_IdAndUser_Id(event.getId(), user.getId());

                if (!isAllowed) {
                        throw new AccessDeniedException(
                                        "You are not allowed to book this event");
                }

                // Booking closed
                if (!event.isBookingOpen()) {
                        throw new RuntimeException("Booking is closed for this event");
                }

                // Prevent duplicate booking
                if (bookingRepository.existsByEvent_IdAndUser_Id(
                                event.getId(), user.getId())) {
                        throw new RuntimeException("You have already booked this event");
                }

                int seatsRequested = request.getSeats();

                if (seatsRequested <= 0) {
                        throw new RuntimeException("Invalid seat count");
                }

                // Seat availability check
                if (event.getAvailableSeats() < seatsRequested) {
                        throw new RuntimeException("Not enough seats available");
                }

                // INVENTORY CHECK (NEW)
                if (request.getInventoryItemId() != null &&
                                request.getInventoryQuantity() > 0) { 

                        boolean available = inventoryClient.checkAvailability(
                                        request.getInventoryItemId(),
                                        request.getInventoryQuantity());

                        if (!available) {
                                throw new RuntimeException("Inventory not available");
                        }
                }

                // Update event seats
                event.setAvailableSeats(
                                event.getAvailableSeats() - seatsRequested);

                if (event.getAvailableSeats() == 0) {
                        event.setBookingOpen(false);
                }

                eventRepository.save(event);

                // Create booking
                Booking booking = Booking.builder()
                                .user(user)

                                .event(event)
                                .numberOfSeats(seatsRequested)
                                .inventoryItemId(request.getInventoryItemId())
                                .inventoryQuantity(request.getInventoryQuantity())
                                .status(BookingStatus.CONFIRMED)
                                .bookedAt(LocalDateTime.now())
                                .build();

                bookingRepository.save(booking);

                // Reduce inventory stock AFTER booking saved
                if (request.getInventoryItemId() != null &&
                                request.getInventoryQuantity() > 0) {

                        inventoryClient.reduceStock(
                                        request.getInventoryItemId(),
                                        request.getInventoryQuantity());
                }

                return mapToResponse(booking);
        }

        public List<BookingResponse> getMyBookings(
                        Authentication authentication) {

                String email = authentication.getName();

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                return bookingRepository.findByUser_Id(user.getId())
                                .stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        // OPTIONAL: Cancel booking & restore inventory
        @Transactional
        public void cancelBooking(Long bookingId, 
                        Authentication authentication) { 

                String email = authentication.getName();

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Booking booking = bookingRepository.findById(bookingId)
                                .orElseThrow(() -> new RuntimeException("Booking not found"));

                if (!booking.getUser().getId().equals(user.getId())) {
                        throw new AccessDeniedException("Not allowed to cancel");
                }

                if (booking.getStatus() == BookingStatus.CANCELLED) {
                        throw new RuntimeException("Booking already cancelled");
                }

                // Restore seats
                Event event = booking.getEvent();
                event.setAvailableSeats(
                                event.getAvailableSeats() +
                                                booking.getNumberOfSeats());
                event.setBookingOpen(true);
                eventRepository.save(event);

                // Restore inventory
                if (booking.getInventoryItemId() != null &&
                                booking.getInventoryQuantity() > 0) {

                        inventoryClient.increaseStock(
                                        booking.getInventoryItemId(),
                                        booking.getInventoryQuantity());
                }

                booking.setStatus(BookingStatus.CANCELLED);
                bookingRepository.save(booking);
        }

        private BookingResponse mapToResponse(Booking booking) {

                return BookingResponse.builder()
                                .bookingId(booking.getId())
                                .eventId(booking.getEvent().getId())
                                .eventTitle(booking.getEvent().getTitle())
                                .location(booking.getEvent().getLocation())
                                .seatsBooked(booking.getNumberOfSeats())
                                .inventoryItemId(booking.getInventoryItemId())
                                .inventoryQuantity(booking.getInventoryQuantity())
                                .status(booking.getStatus().name())
                                .bookedAt(booking.getBookedAt())
                                .build();
        }
}