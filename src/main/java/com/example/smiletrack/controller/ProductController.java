package com.example.smiletrack.controller;

import com.example.smiletrack.dto.ProductDto;
import com.example.smiletrack.dto.ProductWorkflowDto;
import com.example.smiletrack.service.ProductService;
import com.example.smiletrack.service.ProductWorkflowService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;
    private final ProductWorkflowService productWorkflowService;

    public ProductController(ProductService productService, ProductWorkflowService productWorkflowService) {
        this.productService = productService;
        this.productWorkflowService = productWorkflowService;
    }

    @GetMapping
    public List<ProductDto> getProducts() {
        return productService.findAll();
    }

    @GetMapping("/{productId}/workflow")
    public List<ProductWorkflowDto> getWorkflow(@PathVariable Integer productId) {
        return productWorkflowService.getWorkflowByProduct(productId);
    }
}
