package com.eventify.dto.analytics;

import java.util.List;

public class AnalyticsResponse {

    private long totalEvents;
    private long totalBookings;
    private long totalUsers;
    private double totalRevenue;

    private List<EventStats> eventStats;

    // getters & setters

    public long getTotalEvents() {
        return totalEvents;
    }

    public void setTotalEvents(long totalEvents) {
        this.totalEvents = totalEvents;
    }

    public long getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(long totalBookings) {
        this.totalBookings = totalBookings;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public List<EventStats> getEventStats() {
        return eventStats;
    }

    public void setEventStats(List<EventStats> eventStats) {
        this.eventStats = eventStats;
    }

}