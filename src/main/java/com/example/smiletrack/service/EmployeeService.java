package com.example.smiletrack.service;

import com.example.smiletrack.entity.Employee;
import com.example.smiletrack.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmployeeService {

    @Autowired
    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public Employee getEmployeeByLoginId(String loginId) {
        return employeeRepository.findByLoginId(loginId);
    }
}
