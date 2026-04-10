package com.eventify.dto.event;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventParticipantRequest {

    private Long userId;        // selected user id
    private String role;        // MEMBER (HOST is auto-added)\
    
}
