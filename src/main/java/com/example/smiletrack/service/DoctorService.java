package com.example.smiletrack.service;

import com.example.smiletrack.dto.DoctorDto;
import com.example.smiletrack.entity.Doctor;
import com.example.smiletrack.repository.DoctorRepository;
import com.example.smiletrack.repository.ProcessRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DoctorService {

    @Autowired
    DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public List<DoctorDto> findAll() {
        List<Doctor> doctors = doctorRepository.findAll();

        List<DoctorDto> result = new ArrayList<>();

        for (Doctor d : doctors) {
            String clinicName = null;

            if (d.getClinic() != null) {
                clinicName = d.getClinic().getClinicName();
            }

            result.add(
                    new DoctorDto(
                            d.getDoctorId(),
                            d.getDoctorName(),
                            clinicName
                    )
            );
        }

        return result;
    }
}
