package com.eventify.controller;

import com.eventify.dto.Booking.BookingRequest;
import com.eventify.dto.Booking.BookingResponse;
import com.eventify.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public BookingResponse bookEvent(
            @RequestBody BookingRequest request,
            Authentication authentication) {

        return bookingService.bookEvent(request, authentication);
    }

    @GetMapping("/my")
    public List<BookingResponse> myBookings(Authentication authentication) {
        return bookingService.getMyBookings(authentication);
    }
}
