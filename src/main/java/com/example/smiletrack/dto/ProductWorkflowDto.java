package com.example.smiletrack.dto;

import lombok.Getter;

@Getter
public class ProductWorkflowDto {
    private Integer processId;
    private String name;
    private Integer order;

    public ProductWorkflowDto(Integer processId, String name, Integer order) {
        this.processId = processId;
        this.name = name;
        this.order=order;
    }
}
