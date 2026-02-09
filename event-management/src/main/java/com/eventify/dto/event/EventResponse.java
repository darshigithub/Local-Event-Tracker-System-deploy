package com.eventify.dto.event;

import java.time.LocalDate;
import java.time.LocalTime;
import lombok.Data;

@Data
public class EventResponse {
    private Long id;
    private String title;
    private String description;
    private String location;
    private String googleMapUrl;
    private LocalDate eventDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private int totalSeats;
    private int availableSeats;
    private double price;
    private boolean bookingOpen;
    private String hostName;
    private String loggedInUserEmail; // add this
}
