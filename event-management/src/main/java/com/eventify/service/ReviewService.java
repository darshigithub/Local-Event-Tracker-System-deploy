package com.eventify.service;

import com.eventify.dto.review.ReviewRequest;
import com.eventify.dto.review.ReviewResponse;
import com.eventify.entity.*;
import com.eventify.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

        @Autowired
        private ReviewRepository reviewRepository;

        @Autowired
        private EventRepository eventRepository;

        @Autowired
        private EventParticipantRepository eventParticipantRepository;

        @Autowired
        private UserRepository userRepository;

        @Transactional
        public ReviewResponse addReview(
                        ReviewRequest request,
                        Authentication authentication) {

                String email = authentication.getName();

                System.out.println(email + " is trying to add a review for event " + request.getEventId());

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Event event = eventRepository.findById(request.getEventId())
                                .orElseThrow(() -> new RuntimeException("Event not found"));

                // Must be a participant
                EventParticipant participant = eventParticipantRepository
                                .findByEvent_IdAndUser_Id(event.getId(), user.getId())
                                .orElseThrow(() -> new AccessDeniedException("You are not a participant"));

                // Host cannot review
                if (participant.getRole() == EventRole.HOST) {
                        throw new AccessDeniedException("Host cannot review the event");
                }

                // Only one review per user per event
                if (reviewRepository.existsByEvent_IdAndUser_Id(
                                event.getId(), user.getId())) {
                        throw new RuntimeException("You already reviewed this event");
                }

                // Review allowed within 4 days from event date

                // In Java, ChronoUnit is an enum (enumeration) that defines a standard set of
                // date and time units, such as DAYS, MONTHS, and HOURS.

                long days = ChronoUnit.DAYS.between(
                                event.getEventDate(), LocalDateTime.now());

                if (days < 0 || days > 4) {
                        throw new RuntimeException(
                                        "Review allowed only within 4 days of event");
                }

                // Rating validation
                if (request.getRating() < 1 || request.getRating() > 5) {
                        throw new RuntimeException(
                                        "Rating must be between 1 and 5");
                }

                Review review = Review.builder()
                                .event(event)
                                .user(user)
                                .rating(request.getRating())
                                .comment(request.getComment())
                                .reviewedAt(LocalDateTime.now())
                                .build();

                reviewRepository.save(review);

                return mapToResponse(review);
        }

        public List<ReviewResponse> getReviewsForEvent(Long eventId) {

                return reviewRepository.findByEvent_Id(eventId)
                                .stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        private ReviewResponse mapToResponse(Review review) {

                return ReviewResponse.builder()
                                .reviewId(review.getId())
                                .eventId(review.getEvent().getId())
                                .eventTitle(review.getEvent().getTitle())
                                .rating(review.getRating())
                                .comment(review.getComment())
                                .reviewerName(review.getUser().getName())
                                .reviewedAt(review.getReviewedAt())
                                .build();
        }
}