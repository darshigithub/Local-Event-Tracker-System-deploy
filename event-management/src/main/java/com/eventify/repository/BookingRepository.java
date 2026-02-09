package com.eventify.repository;

import com.eventify.entity.Booking;
import com.eventify.entity.Event;
import com.eventify.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    boolean existsByUserAndEvent(User user, Event event);

    List<Booking> findByUser(User user); 

    Optional<Booking> findByIdAndUser(Long id, User user);

    Optional<Booking> findByUserAndEvent(User user, Event event);
 
}
