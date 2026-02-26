package com.example.smiletrack.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "`CASE`")
public class Case {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "case_id")
    private Integer caseId;

    @Column(name = "case_number", nullable = false, length = 50)
    private String caseNumber;

    @Column(name = "patient_name", nullable = false, length = 50)
    private String patientName;

    /* ======================
       FK 관계
       ====================== */

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_type_id", nullable = false)
    private ProductType productType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_holder_id")
    private Employee currentHolder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_location_id")
    private Location currentLocation;

    /* ======================
       도메인 필드
       ====================== */

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "pan_number", length = 50)
    private String panNumber;

    @Column(name = "tooth_numbers", length = 200)
    private String toothNumbers;

    @Enumerated(EnumType.STRING)
    @Column(name = "arch_type")
    private ArchType archType = ArchType.NA;

    @Column(name = "shade", length = 50)
    private String shade = "N/A";

    @Column(name = "material", length = 200)
    private String material;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority")
    private Priority priority = Priority.NORMAL;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_status")
    private CaseStatus currentStatus = CaseStatus.FLOATING;

    @Column(name = "is_active")
    private Boolean active = true;

    /* ======================
       Timestamp
       ====================== */

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    /* ======================
       Enum 정의
       ====================== */

    public enum ArchType {
        UPPER, LOWER, BOTH, NA
    }

    public enum Priority {
        NORMAL, RUSH, SPS
    }

    public enum CaseStatus {
        FLOATING, IN_PROGRESS, COMPLETED, ON_HOLD
    }

}