package com.eventify.dto.Booking;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class BookingResponse {

    private Long bookingId;

    private Long eventId;

    private String eventTitle;

    private String location;

    private int seatsBooked;

    // NEW – Inventory info
    private Long inventoryItemId;

    private int inventoryQuantity;

    // NEW – Booking status
    private String status;

    private LocalDateTime bookedAt;
}