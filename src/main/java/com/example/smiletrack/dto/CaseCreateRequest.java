package com.example.smiletrack.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@ToString
public class CaseCreateRequest {

    private String caseNumber;
    private String panNumber;
    private String patientName;

    private Integer doctorId;
    private String teeth;

    private Integer productId;
    private String shade;
    private String material;

    private LocalDateTime dueDate;
    private String priority;
    private String notes;

    private List<ProcessStep> processes;
}
