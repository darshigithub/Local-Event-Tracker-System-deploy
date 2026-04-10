package com.eventify.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "event_id"})
    }
)
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Existing relations
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    private int numberOfSeats;

    // 🔥 NEW: Inventory integration
    @Column(name = "inventory_item_id")
    private Long inventoryItemId;

    @Column(name = "inventory_quantity")
    private int inventoryQuantity;

    // 🔥 NEW: Booking status for cancellation handling
    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    private LocalDateTime bookedAt;
}