package com.eventify.dto.review;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponse {
    private Long id;
    private String reviewerName;
    private int rating;
    private String comment;
}
