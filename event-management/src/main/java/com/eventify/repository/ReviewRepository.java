package com.eventify.repository;

import com.eventify.entity.Event;
import com.eventify.entity.Review;
import com.eventify.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByEvent(Event event);
    Optional<Review> findByUserAndEvent(User user, Event event);
}
