package com.eventify.service;

import com.eventify.dto.review.ReviewRequest;
import com.eventify.dto.review.ReviewResponse;
import com.eventify.entity.*;
import com.eventify.repository.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final EventRepository eventRepository;
    private final BookingRepository bookingRepository;
    private final UserService userService;

    
    public void addReview(Long eventId, ReviewRequest request) {
        User currentUser = userService.getCurrentUser();
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (event.getHost().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Host cannot review own event");
        }

        bookingRepository.findByUserAndEvent(currentUser, event)
                .orElseThrow(() -> new RuntimeException("You must book the event to review"));

        if (reviewRepository.findByUserAndEvent(currentUser, event).isPresent()) {
            throw new RuntimeException("You already reviewed this event");
        }

        Review review = Review.builder()
                .rating(request.getRating())
                .comment(request.getComment())
                .user(currentUser)
                .event(event)
                .build();

        reviewRepository.save(review);
    }

    
    public List<ReviewResponse> getReviewsForEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        return reviewRepository.findByEvent(event)
                .stream()
                .map(review -> ReviewResponse.builder()
                        .id(review.getId())
                        .reviewerName(review.getUser().getName())
                        .rating(review.getRating())
                        .comment(review.getComment())
                        .build())
                .toList();
    }

    
    public CanReviewResponse canReview(Long eventId, Long userId) {

        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (eventOpt.isEmpty()) {
            return CanReviewResponse.builder()
                    .canReview(false)
                    .reason("Event not found")
                    .build();
        }

        Event event = eventOpt.get();

        User user = userService.getUserById(userId);

        if (user == null) {
            return CanReviewResponse.builder()
                    .canReview(false)
                    .reason("User not found")
                    .build();
        }

        if (event.getHost().getId().equals(userId)) {
            return CanReviewResponse.builder()
                    .canReview(false)
                    .reason("Host cannot review their own event")
                    .build();
        }

        boolean hasBooked = bookingRepository.findByUserAndEvent(user, event).isPresent();
        if (!hasBooked) {
            return CanReviewResponse.builder()
                    .canReview(false)
                    .reason("You must book the event to review")
                    .build();
        }

        boolean alreadyReviewed = reviewRepository.findByUserAndEvent(user, event).isPresent();
        if (alreadyReviewed) {
            return CanReviewResponse.builder()
                    .canReview(false)
                    .reason("You already reviewed this event")
                    .build();
        }

        return CanReviewResponse.builder()
                .canReview(true)
                .reason("")
                .build();
    }

    @Getter
    @Builder
    @AllArgsConstructor
    public static class CanReviewResponse {
        private boolean canReview;
        private String reason;
    }
}
