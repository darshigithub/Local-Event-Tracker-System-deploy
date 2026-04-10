package com.eventify.dto.event;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventStatsResponse {

    private int totalEvents;
    private int activeEvents;
    private int completedEvents;
}