package com.eventify.dto.profile;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BookedEventDTO {

    private Long eventId;
    private String title;
    private LocalDateTime eventDate;
    private String location;
}
