package com.example.smiletrack.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "LOCATION")
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="location_id")
    private Integer locationId;

    @Column(name="location_name", nullable = false, length = 100)
    private String locationName;

    @Column(name="location_code", nullable = false, unique = true, length = 20)
    private String locationCode;

    @Enumerated(EnumType.STRING)
    @Column(name="location_type", nullable = false)
    private LocationType locationType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_location_id")
    private Location parentLocation;

    @Column(name="created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum LocationType {
        ROOM, AREA, SHELF
    }
}