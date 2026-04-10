package com.eventify.dto.event;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventUserResponse {

    private Long userId;
    private String name;
    private String email;
    private String role; // HOST / MEMBER
}
