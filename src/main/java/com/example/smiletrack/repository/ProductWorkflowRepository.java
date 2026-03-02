package com.example.smiletrack.repository;

import com.example.smiletrack.entity.ProductWorkflow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductWorkflowRepository extends JpaRepository<ProductWorkflow, Integer> {
    List<ProductWorkflow> findByProductType_productTypeIdOrderBySequenceOrder(Integer productId);
}
