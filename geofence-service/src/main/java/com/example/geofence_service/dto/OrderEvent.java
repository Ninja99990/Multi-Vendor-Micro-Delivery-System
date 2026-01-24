package com.example.geofence_service.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderEvent {
    private String orderNumber;
    private Long vendorId;
    private Long customerId;
    private double vendorLat;
    private double vendorLng;
    private String status;
    private Long riderId; // Assigned rider ID
    private Long orderId; // Order ID for updates
    private String message;
}
