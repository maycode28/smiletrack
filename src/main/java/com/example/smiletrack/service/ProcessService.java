package com.example.smiletrack.service;
import com.example.smiletrack.entity.Process;
import com.example.smiletrack.dto.ProcessDto;
import com.example.smiletrack.repository.ProcessRepository;
import org.springframework.stereotype.Service;


import java.util.ArrayList;
import java.util.List;

@Service
public class ProcessService {

    private final ProcessRepository processRepository;

    public ProcessService(ProcessRepository processRepository) {
        this.processRepository = processRepository;
    }

    public List<ProcessDto> findAll() {
        List<Process> processes = processRepository.findAll();

        List<ProcessDto> result = new ArrayList<>();

        for (Process p : processes) {
            ProcessDto dto = new ProcessDto(
                    p.getProcessId(),
                    p.getProcessName()
            );
            result.add(dto);
        }

        return result;
    }
}