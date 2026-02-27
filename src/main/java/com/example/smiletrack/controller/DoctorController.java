package com.example.smiletrack.controller;

import com.example.smiletrack.dto.DoctorDto;
import com.example.smiletrack.dto.ProcessDto;
import com.example.smiletrack.service.DoctorService;
import com.example.smiletrack.service.ProcessService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping
    public List<DoctorDto> getDoctors() {
        return doctorService.findAll();
    }
}