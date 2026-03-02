package com.example.smiletrack.service;

import com.example.smiletrack.dto.ProductDto;
import com.example.smiletrack.entity.ProductType;
import com.example.smiletrack.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductDto> findAll() {
        List<ProductType> products = productRepository.findAll();

        List<ProductDto> result = new ArrayList<>();

        for (ProductType p : products) {

            result.add(
                    new ProductDto(
                            p.getProductTypeId(),
                            p.getProductName(),
                            p.getCategory()
                    )
            );
        }

        return result;
    }
}
