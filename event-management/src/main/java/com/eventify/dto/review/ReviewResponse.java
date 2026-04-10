package com.eventify.dto.review;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ReviewResponse {

    private Long reviewId;
    private Long eventId;
    private String eventTitle;
    private int rating;
    private String comment;
    private String reviewerName;
    private LocalDateTime reviewedAt;
    
}
