package com.example.smiletrack.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "PRODUCT_TYPE")
public class ProductType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="product_type_id")
    private Integer productTypeId;

    @Column(name="product_name", nullable = false, length = 100)
    private String productName;

    private String category;

    @Column(name="created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}