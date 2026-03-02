package com.example.smiletrack.service;

import com.example.smiletrack.dto.ProductWorkflowDto;
import com.example.smiletrack.entity.ProductWorkflow;
import com.example.smiletrack.repository.ProductWorkflowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProductWorkflowService {

    @Autowired
    ProductWorkflowRepository productWorkflowRepository;

    public ProductWorkflowService(ProductWorkflowRepository productWorkflowRepository) {
        this.productWorkflowRepository = productWorkflowRepository;
    }

    public List<ProductWorkflowDto> getWorkflowByProduct(Integer productId) {
        List<ProductWorkflow> workflows =
                productWorkflowRepository.findByProductType_productTypeIdOrderBySequenceOrder(productId);

        List<ProductWorkflowDto> result = new ArrayList<>();

        for (ProductWorkflow w : workflows) {
            String processName=null;
            int processId=0;
            if (w.getProcess() != null) {
                processName = w.getProcess().getProcessName();
                processId=w.getProcess().getProcessId();
            }
            result.add(
                    new ProductWorkflowDto(
                            processId,
                            processName,
                            w.getSequenceOrder()
                    )
            );

        }

        return result;
    }
}
