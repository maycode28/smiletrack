package com.example.smiletrack.dto;

import lombok.Getter;

@Getter
public class ProductDto {
    private Integer id;
    private String name;
    private String category;

    public ProductDto(Integer id, String name, String category) {
        this.id = id;
        this.name = name;
        this.category=category;
    }

}