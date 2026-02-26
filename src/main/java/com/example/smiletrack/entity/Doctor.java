package com.example.smiletrack.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "DOCTOR")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="doctor_id")
    private Integer doctorId;

    @Column(name="doctor_name", nullable = false, length = 100)
    private String doctorName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "clinic_id", nullable = false)
    private Clinic clinic;

    private String email;
    @Column(name="phone_number")
    private String phoneNumber;

    @Column(columnDefinition = "TEXT")
    private String preferences;


    @Column(name="is_active")
    private Boolean isActive = true;

    @Column(name="created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}