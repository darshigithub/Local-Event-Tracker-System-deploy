package com.eventify.dto.Booking;

import lombok.Data;

@Data
public class BookingRequest {

    private Long eventId;

    private int seats;

    // NEW – Inventory integration
    private Long inventoryItemId;

    private int inventoryQuantity;
}