package com.example.smiletrack.repository;

import com.example.smiletrack.entity.LabCase;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LabCaseRepository extends JpaRepository<LabCase, Integer> {
}