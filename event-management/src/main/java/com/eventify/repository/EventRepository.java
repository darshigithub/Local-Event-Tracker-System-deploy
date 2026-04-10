package com.eventify.repository;

import com.eventify.entity.Event;
import com.eventify.entity.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByHost(User host);

}
