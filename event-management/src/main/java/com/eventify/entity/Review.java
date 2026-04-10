package com.eventify.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"event_id", "user_id"})
    }
)
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    private int rating; // 1–5

    @Column(length = 500)
    private String comment;

    private LocalDateTime reviewedAt;
}
