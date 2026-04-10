package com.eventify.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 1000)
    private String description;

    private String location;

    @Column(length = 1000)
    private String googleMapUrl;

    private LocalDate eventDate;

    private LocalTime startTime;

    private LocalTime endTime;

    private int totalSeats;

    private int availableSeats;

    private boolean bookingOpen;

    private double price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id", nullable = false)
    private User host;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    // Set is used to prevent duplicate participants for the same event
    private Set<EventParticipant> participants = new HashSet<>();
}