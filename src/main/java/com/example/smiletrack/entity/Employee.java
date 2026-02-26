package com.example.smiletrack.entity;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "EMPLOYEE")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="employee_id")
    private Integer employeeId;

    @Column(name="employee_name", nullable = false, length = 100)
    private String employeeName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    private String role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "default_location_id")
    private Location defaultLocation;

    @Column(name="shift_start", nullable = false)
    private LocalTime shiftStart= LocalTime.of(9, 0);
    @Column(name="shift_end", nullable = false)
    private LocalTime shiftEnd= LocalTime.of(18, 0);

    @Column(name="is_manager")
    private Boolean isManager = false;
    @Column(name="is_active")
    private Boolean isActive = true;

    @Column(name="created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Role {
        TECHNICIAN, MANAGER
    }
}