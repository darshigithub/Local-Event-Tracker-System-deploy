package com.eventify.dto.Booking;

import lombok.Data;

@Data
public class BookingRequest {
    private Long eventId;
    private int seats;
}
