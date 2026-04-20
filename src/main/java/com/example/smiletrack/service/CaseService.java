package com.example.smiletrack.service;

import com.example.smiletrack.dto.CaseCreateRequest;
import com.example.smiletrack.dto.ProcessStep;
import com.example.smiletrack.entity.*;
import com.example.smiletrack.entity.Process;
import com.example.smiletrack.repository.*;
import com.example.smiletrack.util.Rq;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CaseService {
    private final LabCaseRepository labCaseRepository;
    private final DoctorRepository doctorRepository;
    private final ProductRepository productRepository;
    private final ProcessRepository processRepository;
    private final LabCaseProcessRepository labCaseProcessRepository;
    private final LabCaseNoteRepository labCaseNoteRepository;

    private static final Set<Integer> UPPER_TEETH = Set.of(
            18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28
    );

    private static final Set<Integer> LOWER_TEETH = Set.of(
            48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38
    );

    private Set<Integer> parseTeeth(String teeth) {
        if (teeth == null || teeth.isBlank()) {
            return Collections.emptySet();
        }

        return Arrays.stream(teeth.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(Integer::valueOf)
                .collect(Collectors.toSet());
    }

    private LabCase.ArchType determineArchType(String teethString) {

        Set<Integer> selected = parseTeeth(teethString);

        if (selected.isEmpty()) {
            return LabCase.ArchType.NA;
        }

        boolean isUpperAll = selected.containsAll(UPPER_TEETH);
        boolean isLowerAll = selected.containsAll(LOWER_TEETH);

        if (isUpperAll && isLowerAll) {
            return LabCase.ArchType.BOTH;
        }

        if (isUpperAll) {
            return LabCase.ArchType.UPPER;
        }

        if (isLowerAll) {
            return LabCase.ArchType.LOWER;
        }

        return LabCase.ArchType.NA;
    }

    private static final int WORK_HOURS_PER_DAY = 8;
    private static final int WORK_START_HOUR = 9;
    private boolean isWeekend(LocalDate date) {
        DayOfWeek day = date.getDayOfWeek();
        return day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY;
    }
    private LocalDateTime nextWorkingDayStart(LocalDateTime time) {

        LocalDate date = time.toLocalDate();

        while (isWeekend(date)) {
            date = date.plusDays(1);
        }

        return date.atTime(WORK_START_HOUR, 0);
    }

    private LocalDateTime calculateEndTime(LocalDateTime start, int durationHours) {

        LocalDateTime current = start;
        int remainingHours = durationHours;

        if (isWeekend(current.toLocalDate())) {
            current = nextWorkingDayStart(current);
        }

        while (remainingHours > 0) {

            LocalDateTime endOfWorkDay =
                    current.toLocalDate().atTime(WORK_START_HOUR+WORK_HOURS_PER_DAY, 0);

            long availableToday =
                    Duration.between(current, endOfWorkDay).toHours();

            if (availableToday <= 0) {
                current = nextWorkingDayStart(current.plusDays(1));
                continue;
            }

            if (remainingHours <= availableToday) {
                return current.plusHours(remainingHours);
            }

            remainingHours -= (int) availableToday;
            current = nextWorkingDayStart(current.plusDays(1));
        }

        return current;
    }

    public void createCase(CaseCreateRequest req, Rq rq) {
        Employee loggedInEmployee = rq.getLoggedInEmployee();

        if (loggedInEmployee == null) {
            throw new IllegalStateException("로그인한 사용자 정보가 없습니다.");
        }

        // 참조 엔티티 조회
        Doctor doctor = doctorRepository.findById(req.getDoctorId())
                .orElseThrow();

        ProductType productType = productRepository.findById(req.getProductId())
                .orElseThrow();

        LabCase.Priority priority;

        try {
            priority = LabCase.Priority.valueOf(req.getPriority().toUpperCase(Locale.ROOT));
        } catch (Exception e) {
            throw new IllegalArgumentException("유효하지 않은 우선순위입니다.");
        }

        // CASE 저장 (부모)
        LabCase labCase = LabCase.builder()
                .caseNumber(req.getCaseNumber())
                .patientName(req.getPatientName())
                .panNumber(req.getPanNumber())
                .dueDate(req.getDueDate())
                .shade(req.getShade())
                .material(req.getMaterial())
                .priority(priority)
                .doctor(doctor)
                .productType(productType)
                .toothNumbers(req.getTeeth())
                .archType(determineArchType(req.getTeeth()))
                .currentHolder(loggedInEmployee)
                .currentLocation(loggedInEmployee.getDefaultLocation())
                .build();

        labCaseRepository.save(labCase);

        LocalDateTime cursor = LocalDateTime.now();

        if (cursor.getHour() < WORK_START_HOUR ||
                cursor.getHour() >= WORK_START_HOUR + WORK_HOURS_PER_DAY) {

            cursor = cursor.toLocalDate()
                    .plusDays(cursor.getHour() >= WORK_START_HOUR + WORK_HOURS_PER_DAY ? 1 : 0)
                    .atTime(WORK_START_HOUR, 0);
        }

        for (ProcessStep step : req.getProcesses()) {

            Process process = processRepository.findById(step.getProcessId())
                    .orElseThrow();

            LocalDateTime start = cursor;
            LocalDateTime end = calculateEndTime(start, process.getDurationHours());

            LabCaseProcess lcp = LabCaseProcess.builder()
                    .labCase(labCase)
                    .process(process)
                    .sequenceOrder(step.getSequenceOrder())
                    .scheduledStart(start.toLocalDate())
                    .scheduledEnd(end.toLocalDate())
                    .build();

            labCaseProcessRepository.save(lcp);

            cursor = end;
        }

        LabCaseNote lcn = LabCaseNote.builder()
                .labCase(labCase)
                .employee(loggedInEmployee)
                .noteContent(req.getNotes())
                .build();
        labCaseNoteRepository.save(lcn);

    }
}
