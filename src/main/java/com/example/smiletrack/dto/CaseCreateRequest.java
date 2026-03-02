package com.example.smiletrack.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@ToString
public class CaseCreateRequest {

    private String caseNumber;
    private String panNumber;
    private String patientName;

    private Long doctorId;
    private String teeth;

    private Long productId;
    private String shade;
    private String material;

    private LocalDate dueDate;
    private String priority;
    private String notes;

    private List<ProcessStep> processes;
}