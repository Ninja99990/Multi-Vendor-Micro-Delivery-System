package com.example.order_service.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderEvent {
    
    private String orderNumber;
    private Long vendorId;
    private Long customerId;
    
    // Critical for Geofencing/Delivery service
    private double vendorLat;
    private double vendorLng;
    
    private String status;
    private String message;
    private Long riderId; // Assigned rider ID
    private Long orderId; // Order ID for updates
}