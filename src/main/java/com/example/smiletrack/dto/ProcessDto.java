package com.example.smiletrack.dto;

import lombok.Getter;

@Getter
public class ProcessDto {
    private Integer id;
    private String name;

    public ProcessDto(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

}