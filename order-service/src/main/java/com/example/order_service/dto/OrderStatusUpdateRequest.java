package com.example.order_service.dto;

import com.example.order_service.model.OrderStatus;
import lombok.Data;

@Data
public class OrderStatusUpdateRequest {
    private OrderStatus status;
    private Long riderId; // Optional: for assigning rider when status is ACCEPTED
}
