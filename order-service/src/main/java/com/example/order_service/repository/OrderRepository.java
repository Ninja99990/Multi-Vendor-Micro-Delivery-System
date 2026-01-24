package com.example.order_service.repository;

import com.example.order_service.model.Order;
import com.example.order_service.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Order findByOrderNumber(String orderNumber);
    List<Order> findByCustomerId(Long customerId);
    List<Order> findByVendorId(Long vendorId);
    List<Order> findByAssignedRiderId(Long riderId);
    List<Order> findByStatus(OrderStatus status);
}