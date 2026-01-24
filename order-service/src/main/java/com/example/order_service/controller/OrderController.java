package com.example.order_service.controller;

import com.example.order_service.dto.OrderRequest;
import com.example.order_service.dto.OrderStatusUpdateRequest;
import com.example.order_service.model.Order;
import com.example.order_service.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Order Management", description = "APIs for managing delivery orders")
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/place")
    @Operation(
        summary = "Place a new delivery order",
        description = "Creates a new order and publishes it to Kafka for geofence processing"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "Order placed successfully",
            content = @Content(schema = @Schema(implementation = Order.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid request data"
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error"
        )
    })
    public ResponseEntity<Order> placeOrder(@RequestBody OrderRequest request) {
        Order savedOrder = orderService.placeOrder(request);
        return new ResponseEntity<>(savedOrder, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all orders", description = "Retrieves all orders in the system")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order by ID", description = "Retrieves a specific order by its ID")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping("/order-number/{orderNumber}")
    @Operation(summary = "Get order by order number", description = "Retrieves an order by its unique order number")
    public ResponseEntity<Order> getOrderByOrderNumber(@PathVariable String orderNumber) {
        return ResponseEntity.ok(orderService.getOrderByOrderNumber(orderNumber));
    }

    @GetMapping("/customer/{customerId}")
    @Operation(summary = "Get orders by customer ID", description = "Retrieves all orders for a specific customer")
    public ResponseEntity<List<Order>> getOrdersByCustomerId(@PathVariable Long customerId) {
        return ResponseEntity.ok(orderService.getOrdersByCustomerId(customerId));
    }

    @GetMapping("/vendor/{vendorId}")
    @Operation(summary = "Get orders by vendor ID", description = "Retrieves all orders for a specific vendor")
    public ResponseEntity<List<Order>> getOrdersByVendorId(@PathVariable Long vendorId) {
        return ResponseEntity.ok(orderService.getOrdersByVendorId(vendorId));
    }

    @PutMapping("/{id}/status")
    @Operation(
        summary = "Update order status",
        description = "Updates the status of an order and optionally assigns a rider"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Order status updated successfully"),
        @ApiResponse(responseCode = "404", description = "Order not found"),
        @ApiResponse(responseCode = "400", description = "Invalid status update")
    })
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody OrderStatusUpdateRequest request) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, request));
    }

    @PutMapping("/{id}/assign-rider/{riderId}")
    @Operation(
        summary = "Assign rider to order",
        description = "Assigns a rider to an order and sets status to ACCEPTED"
    )
    public ResponseEntity<Order> assignRider(
            @PathVariable Long id,
            @PathVariable Long riderId) {
        return ResponseEntity.ok(orderService.assignRider(id, riderId));
    }
}