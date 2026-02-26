package com.example.smiletrack.service;

import com.example.smiletrack.entity.Clinic;
import com.example.smiletrack.repository.ClinicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ClinicService {

    @Autowired
    private ClinicRepository clinicRepository;

    public void createClinic(Clinic clinic) {
        clinicRepository.save(clinic);
    }
}
