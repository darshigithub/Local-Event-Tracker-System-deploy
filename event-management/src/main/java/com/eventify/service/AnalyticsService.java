package com.eventify.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.eventify.dto.analytics.AnalyticsResponse;
import com.eventify.dto.analytics.EventStats;
import com.eventify.entity.Booking; 
import com.eventify.repository.BookingRepository;
import com.eventify.repository.EventRepository;
import com.eventify.repository.UserRepository;
import lombok.RequiredArgsConstructor; 

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final EventRepository eventRepo;
    private final BookingRepository bookingRepo;
    private final UserRepository userRepo;

    public AnalyticsResponse getAnalytics() {

        AnalyticsResponse res = new AnalyticsResponse();

        res.setTotalEvents(eventRepo.count());
        res.setTotalBookings(bookingRepo.count());
        res.setTotalUsers(userRepo.count()); 

        // Total revenue
        double revenue = bookingRepo.findAll()
                .stream()
                .mapToDouble(b -> b.getEvent().getPrice() * b.getNumberOfSeats())
                .sum(); 

        res.setTotalRevenue(revenue);

        // Event-wise stats
        List<EventStats> stats = eventRepo.findAll().stream().map(event -> {

            List<Booking> bookings = bookingRepo.findByEvent_Id(event.getId());

            EventStats es = new EventStats();
            es.setEventId(event.getId());
            es.setTitle(event.getTitle());
            es.setBookings(bookings.size());

            double eventRevenue = bookings.stream()
                    .mapToDouble(b -> event.getPrice() * b.getNumberOfSeats())
                    .sum();

            es.setRevenue(eventRevenue); 

            return es;
        }).toList();

        res.setEventStats(stats);

        System.out.println(res); // DEBUG

        return res;
    }
}