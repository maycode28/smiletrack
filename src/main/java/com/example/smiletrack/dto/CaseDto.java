package com.example.smiletrack.dto;

import lombok.Getter;

@Getter
public class CaseDto {
    private String caseNo;
    private String panNo;
    private String patientName;
    private String productName;
    private String doctorName;
    private String currentProcess;
    private int progress;
    private int totalSteps;
    private int progressSteps;
    private String timeline;
    private String timelineType;
}