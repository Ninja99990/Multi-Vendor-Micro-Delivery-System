package com.example.geofence_service.consumer;

import com.example.geofence_service.dto.OrderEvent;
import com.example.geofence_service.service.GeofenceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderEventConsumer {

    private final GeofenceService geofenceService;

    @KafkaListener(topics = "order-events", groupId = "geofence-group")
    public void handleOrderEvent(OrderEvent event) {
        log.info("Received Kafka Event for Order: {}", event.getOrderNumber());
        geofenceService.processOrderGeofence(event);
    }
}
