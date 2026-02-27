package com.example.smiletrack.repository;

import com.example.smiletrack.entity.Process;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProcessRepository extends JpaRepository<Process, Integer> {
}