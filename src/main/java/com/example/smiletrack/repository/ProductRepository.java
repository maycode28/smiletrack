package com.example.smiletrack.repository;

import com.example.smiletrack.entity.ProductType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<ProductType, Integer> {

    List<ProductType> findAll();
}