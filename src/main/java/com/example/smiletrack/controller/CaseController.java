package com.example.smiletrack.controller;

import com.example.smiletrack.dto.CaseCreateRequest;
import com.example.smiletrack.service.CaseService;
import com.example.smiletrack.util.Rq;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cases")
@CrossOrigin(origins = "http://localhost:3000")
public class CaseController {
    @Autowired
    private CaseService caseService;

    private final Rq rq;

    public CaseController(Rq rq){
        this.rq=rq;
    }


    @PostMapping
    public ResponseEntity<String> createCase(@RequestBody CaseCreateRequest request) {

        caseService.createCase(request,rq);
        return ResponseEntity.ok("등록 완료");
    }
}
