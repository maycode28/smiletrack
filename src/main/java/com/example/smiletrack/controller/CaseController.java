package com.example.smiletrack.controller;

import com.example.smiletrack.dto.CaseCreateRequest;
import com.example.smiletrack.service.CaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cases")
@CrossOrigin(origins = "http://localhost:3000")
public class CaseController {
    @Autowired
    private CaseService caseService;

    @PostMapping
    public ResponseEntity<String> createCase(@RequestBody CaseCreateRequest dto) {
        System.out.println(dto);
        return ResponseEntity.ok("등록 완료");
    }
}
