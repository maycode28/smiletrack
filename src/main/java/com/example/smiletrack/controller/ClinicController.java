package com.example.smiletrack.controller;

import com.example.smiletrack.entity.Clinic;
import com.example.smiletrack.service.ClinicService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/clinic")
@CrossOrigin(origins = "http://localhost:3000")
public class ClinicController {
    private final ClinicService clinicService;

    public ClinicController(ClinicService clinicService) {
        this.clinicService = clinicService;
    }

    @PostMapping
    public ResponseEntity<?> createClinic(@RequestBody Clinic clinic) {
        clinicService.createClinic(clinic);
        return ResponseEntity.ok(Map.of("resultCode", "S-1", "msg", "등록 완료"));
    }
}
