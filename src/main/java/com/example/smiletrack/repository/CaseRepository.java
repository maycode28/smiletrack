package com.example.smiletrack.repository;

import com.example.smiletrack.entity.Case;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CaseRepository extends JpaRepository<Case, Integer> {
}