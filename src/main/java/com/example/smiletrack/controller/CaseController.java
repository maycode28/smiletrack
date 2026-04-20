package com.example.smiletrack.controller;

import com.example.smiletrack.dto.CaseCreateRequest;
import com.example.smiletrack.service.CaseService;
import com.example.smiletrack.util.Rq;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

        caseService.createCase(request, rq);
        return ResponseEntity.ok(Map.of("resultCode", "S-1", "msg", "등록 완료"));
    }
}
