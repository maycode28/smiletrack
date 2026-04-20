package com.example.smiletrack.controller;

import com.example.smiletrack.dto.CaseCreateRequest;
import com.example.smiletrack.service.CaseService;
import com.example.smiletrack.util.Rq;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cases")
@CrossOrigin(origins = "http://localhost:3000")
public class CaseController {
    private final CaseService caseService;

    private final Rq rq;

    public CaseController(CaseService caseService, Rq rq){
        this.caseService = caseService;
        this.rq = rq;
    }


    @PostMapping
    public ResponseEntity<?> createCase(@RequestBody CaseCreateRequest request) {
        if (!rq.isLoggedIn()) {
            return ResponseEntity.status(401)
                    .body(Map.of("resultCode", "F-1", "msg", "로그인 후 케이스를 등록할 수 있습니다."));
        }

        if (request.getPatientName() == null || request.getPatientName().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("resultCode", "F-2", "msg", "환자명을 입력해 주세요."));
        }

        if (request.getDoctorId() == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("resultCode", "F-3", "msg", "의사를 선택해 주세요."));
        }

        if (request.getProductId() == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("resultCode", "F-4", "msg", "제품을 선택해 주세요."));
        }

        List<?> processes = request.getProcesses();

        if (processes == null || processes.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("resultCode", "F-5", "msg", "공정을 1개 이상 추가해 주세요."));
        }

        if (request.getDueDate() == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("resultCode", "F-6", "msg", "납기일을 입력해 주세요."));
        }

        LocalDateTime now = LocalDateTime.now().truncatedTo(ChronoUnit.MINUTES);

        if (request.getDueDate().isBefore(now)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("resultCode", "F-7", "msg", "납기일은 현재 시각 이후로 입력해 주세요."));
        }

        try {
            caseService.createCase(request, rq);
            return ResponseEntity.ok(Map.of("resultCode", "S-1", "msg", "등록 완료"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("resultCode", "F-8", "msg", e.getMessage()));
        }
    }
}
