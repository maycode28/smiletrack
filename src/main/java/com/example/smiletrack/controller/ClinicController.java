package com.example.smiletrack.controller;

import com.example.smiletrack.repository.ClinicRepository;
import com.example.smiletrack.entity.Clinic;
import com.example.smiletrack.service.ClinicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clinic")
@CrossOrigin(origins = "http://localhost:3000")
public class ClinicController {

    @Autowired
    private ClinicService clinicService;

    @PostMapping
    public ResponseEntity<String> createClinic(@RequestBody Clinic clinic) {
        clinicService.createClinic(clinic);
        return ResponseEntity.ok("등록 완료");
    }
}