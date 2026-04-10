package com.eventify.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.eventify.dto.analytics.AnalyticsResponse;
import com.eventify.service.AnalyticsService;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping
    public AnalyticsResponse getAnalytics() {
        return analyticsService.getAnalytics(); 
    }
}