package com.eventify.dto.review;

import lombok.Data;

@Data
public class ReviewRequest {
    private Long eventId;
    private int rating;   // 1 to 5
    private String comment;
}
