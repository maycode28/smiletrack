package com.example.smiletrack.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "CASE_PROCESS")
public class CaseProcess {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name ="case_process_id")
    private Integer caseProcessId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id", nullable = false)
    private Case caseEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "process_id", nullable = false)
    private Process process;

    @Column(name ="sequence_order", nullable = false)
    private Integer sequenceOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_employee_id")
    private Employee assignedEmployee;

    @Column(name ="scheduled_start")
    private LocalDate scheduledStart;
    @Column(name ="scheduled_end")
    private LocalDate scheduledEnd;

    @Column(name ="actual_start")
    private LocalDateTime actualStart;
    @Column(name ="actual_end")
    private LocalDateTime actualEnd;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    @Column(name ="days_variance")
    private Integer daysVariance = 0;

    @Column(name ="created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    @Column(name ="updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum Status {
        PENDING, ASSIGNED, IN_PROGRESS, COMPLETED, SKIPPED
    }
}