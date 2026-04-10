package com.eventify.dto.event;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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

    // Host details
    private String hostName;

    // Logged-in user info
    private String loggedInUserEmail;

    // Users allowed for this event
    private List<EventUserResponse> participants; 

    private boolean isHost;
    
    private boolean registered;
    
}
