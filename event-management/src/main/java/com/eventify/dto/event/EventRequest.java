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
public class EventRequest {

    private String title;

    private String description;

    private String location;

    private String googleMapUrl;

    private LocalDate eventDate;     // YYYY-MM-DD

    private LocalTime startTime;     // HH:mm

    private LocalTime endTime;       // HH:mm

    private int totalSeats;

    private double price;

    // Selected users who can access this event
    private List<EventParticipantRequest> participants;
}
