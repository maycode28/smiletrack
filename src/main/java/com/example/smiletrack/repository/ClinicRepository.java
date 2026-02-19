package com.example.smiletrack.repository;

import com.example.smiletrack.vo.Clinic;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ClinicRepository {
    void insertClinic(Clinic clinic);
}