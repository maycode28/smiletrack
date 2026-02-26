package com.example.smiletrack.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "PROCESS")
public class Process {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="process_id")
    private Integer processId;

    @Column(name="process_name", nullable = false, length = 100)
    private String processName;

    @Column(name="process_code", nullable = false, unique = true, length = 20)
    private String processCode;

    @Column(name="duration_hours", nullable = false)
    private Integer durationHours = 8;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "default_location_id")
    private Location defaultLocation;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name="created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}