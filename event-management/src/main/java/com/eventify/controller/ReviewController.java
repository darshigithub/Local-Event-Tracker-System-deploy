package com.eventify.controller;

import com.eventify.dto.review.ReviewRequest;
import com.eventify.dto.review.ReviewResponse;
import com.eventify.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ReviewResponse addReview(
            @RequestBody ReviewRequest request,
            Authentication authentication) {

        System.out.println("HelloWorld!");

        System.out.println("Received review request: " + request + " from user: " + authentication.getName());
        return reviewService.addReview(request, authentication);
    }

    @GetMapping("/event/{eventId}")
    public List<ReviewResponse> getReviews(@PathVariable Long eventId) {
        return reviewService.getReviewsForEvent(eventId);
    }
}
