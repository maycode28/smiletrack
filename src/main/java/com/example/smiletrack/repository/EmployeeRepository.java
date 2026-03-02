package com.example.smiletrack.repository;

import com.example.smiletrack.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
    Employee findByLoginId(String loginId);
}
