package com.eventify.repository;

import com.eventify.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    boolean existsByEvent_IdAndUser_Id(Long eventId, Long userId);

    List<Review> findByEvent_Id(Long eventId);

    Optional<Review> findByEvent_IdAndUser_Id(Long eventId, Long userId);
}
