package com.example.order_service.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderRequest {
    private Long customerId;
    private Long vendorId;
    private BigDecimal totalAmount;
    private double vendorLat;
    private double vendorLng;
}