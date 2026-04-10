package com.eventify.repository;

import com.eventify.entity.EventParticipant;
import com.eventify.entity.EventRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventParticipantRepository extends JpaRepository<EventParticipant, Long> {

        // Check if user has access to an event
        boolean existsByEvent_IdAndUser_Id(Long eventId, Long userId);

        // Check if user is HOST of the event
        boolean existsByEvent_IdAndUser_IdAndRole(
                        Long eventId,
                        Long userId,
                        EventRole role);

        // Get a specific participant
        Optional<EventParticipant> findByEvent_IdAndUser_Id(
                        Long eventId, Long userId);

        // Get all participants of an event
        List<EventParticipant> findByEvent_Id(Long eventId);

        // Get all events a user participates in
        List<EventParticipant> findByUser_Id(Long userId);

        // Remove a user from an event
        void deleteByEvent_IdAndUser_Id(Long eventId, Long userId);

        // Remove all participants (used when deleting event)
        void deleteByEvent_Id(Long eventId);
}