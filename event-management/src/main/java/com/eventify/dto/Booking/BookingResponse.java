package com.eventify.dto.Booking;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BookingResponse {
    private Long bookingId;
    private String eventTitle;
    private String location;
    private int seatsBooked;
}
