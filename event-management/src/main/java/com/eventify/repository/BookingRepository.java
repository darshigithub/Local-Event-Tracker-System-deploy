package com.eventify.repository;

import com.eventify.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    boolean existsByEvent_IdAndUser_Id(Long eventId, Long userId);

    List<Booking> findByUser_Id(Long userId);

    List<Booking> findByEvent_Id(Long eventId);

    Optional<Booking> findByIdAndUser_Id(Long bookingId, Long userId);

    Optional<Booking> findByEvent_IdAndUser_Id(Long eventId, Long userId);
    
}
