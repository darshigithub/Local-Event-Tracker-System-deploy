package com.eventify.dto.profile;

import lombok.Data;
import java.util.List;

@Data
public class ProfileResponse {

    private String name;
    private String email;

    private List<BookedEventDTO> bookedEvents;
    private List<HostedEventDTO> hostedEvents;
}
