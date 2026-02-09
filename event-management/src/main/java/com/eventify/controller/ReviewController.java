package com.eventify.controller;

import com.eventify.dto.review.ReviewRequest;
import com.eventify.dto.review.ReviewResponse;
import com.eventify.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    
    @PostMapping("/{eventId}")
    public ResponseEntity<String> addReview(
            @PathVariable Long eventId,
            @RequestBody ReviewRequest request) {

        reviewService.addReview(eventId, request);
        return ResponseEntity.ok("Review added successfully");
    }

    
    @GetMapping("/{eventId}")
    public ResponseEntity<List<ReviewResponse>> getReviews(@PathVariable Long eventId) {
        return ResponseEntity.ok(reviewService.getReviewsForEvent(eventId));
    }
    

    @GetMapping("/can-review/{eventId}/{userId}")
    public ResponseEntity<ReviewService.CanReviewResponse> canReview(
            @PathVariable Long eventId,
            @PathVariable Long userId) {

        return ResponseEntity.ok(reviewService.canReview(eventId, userId));
    }
}
