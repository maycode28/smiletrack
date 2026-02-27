package com.example.smiletrack.dto;

import lombok.Getter;

@Getter
public class DoctorDto {
    private Integer id;
    private String name;
    private String clinicName;

    public DoctorDto(Integer id, String name, String clinicName) {
        this.id = id;
        this.name = name;
        this.clinicName=clinicName;
    }

}