package com.eventify.controller;

import com.eventify.dto.Booking.BookingRequest;
import com.eventify.dto.Booking.BookingResponse;
import com.eventify.entity.Booking;
import com.eventify.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    
    @PostMapping
    public BookingResponse bookEvent(@RequestBody BookingRequest request) {
        return bookingService.bookEvent(request);
    }

    
    @GetMapping("/my")
    public List<Booking> myBookings() {
        return bookingService.getMyBookings();
    }
}
