package com.example.order_service.service;

import com.example.order_service.dto.OrderEvent;
import com.example.order_service.dto.OrderRequest;
import com.example.order_service.dto.OrderStatusUpdateRequest;
import com.example.order_service.model.Order;
import com.example.order_service.model.OrderStatus;
import com.example.order_service.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderProducer orderProducer;

    @Transactional
    public Order placeOrder(OrderRequest request) {
        // 1. Create and Save Entity
        Order order = Order.builder()
                .orderNumber(UUID.randomUUID().toString())
                .customerId(request.getCustomerId())
                .vendorId(request.getVendorId())
                .totalAmount(request.getTotalAmount())
                .vendorLat(request.getVendorLat())
                .vendorLng(request.getVendorLng())
                .status(OrderStatus.PLACED)
                .build();

        Order savedOrder = orderRepository.save(order);

        // 2. Prepare and Send Event
        OrderEvent event = OrderEvent.builder()
                .orderNumber(savedOrder.getOrderNumber())
                .vendorId(savedOrder.getVendorId())
                .customerId(savedOrder.getCustomerId())
                .vendorLat(request.getVendorLat())
                .vendorLng(request.getVendorLng())
                .status(savedOrder.getStatus().name())
                .message("Order has been placed successfully")
                .build();

        orderProducer.sendMessage(event);

        return savedOrder;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    public Order getOrderByOrderNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber);
    }

    public List<Order> getOrdersByCustomerId(Long customerId) {
        return orderRepository.findByCustomerId(customerId);
    }

    public List<Order> getOrdersByVendorId(Long vendorId) {
        return orderRepository.findByVendorId(vendorId);
    }

    @Transactional
    public Order updateOrderStatus(Long id, OrderStatusUpdateRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

        // Update status
        order.setStatus(request.getStatus());

        // Assign rider if provided and status is ACCEPTED
        if (request.getRiderId() != null && request.getStatus() == OrderStatus.ACCEPTED) {
            order.setAssignedRiderId(request.getRiderId());
        }

        Order updatedOrder = orderRepository.save(order);

        // Send status update event
        OrderEvent event = OrderEvent.builder()
                .orderNumber(updatedOrder.getOrderNumber())
                .vendorId(updatedOrder.getVendorId())
                .customerId(updatedOrder.getCustomerId())
                .status(updatedOrder.getStatus().name())
                .riderId(updatedOrder.getAssignedRiderId())
                .message("Order status updated to " + updatedOrder.getStatus())
                .build();

        orderProducer.sendMessage(event);

        return updatedOrder;
    }

    @Transactional
    public Order assignRider(Long orderId, Long riderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        order.setAssignedRiderId(riderId);
        order.setStatus(OrderStatus.ACCEPTED);

        Order updatedOrder = orderRepository.save(order);

        // Send assignment event
        OrderEvent event = OrderEvent.builder()
                .orderNumber(updatedOrder.getOrderNumber())
                .vendorId(updatedOrder.getVendorId())
                .customerId(updatedOrder.getCustomerId())
                .status(updatedOrder.getStatus().name())
                .riderId(riderId)
                .message("Rider " + riderId + " assigned to order")
                .build();

        orderProducer.sendMessage(event);

        return updatedOrder;
    }
}