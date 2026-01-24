package com.example.order_service.service;

import com.example.order_service.dto.OrderEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderProducer {

    private final KafkaTemplate<String, OrderEvent> kafkaTemplate;

    public void sendMessage(OrderEvent event) {
        log.info("Sending Order Event to Kafka: {}", event);

        try {
            // Build the message with headers
            Message<OrderEvent> message = MessageBuilder
                    .withPayload(event)
                    .setHeader(KafkaHeaders.TOPIC, "order-events")
                    .setHeader(KafkaHeaders.KEY, event.getOrderNumber())
                    .build();

            kafkaTemplate.send(message);
            log.info("Order event sent successfully to Kafka");
        } catch (Exception e) {
            // Log error but don't fail the order placement if Kafka is unavailable
            log.error("Failed to send order event to Kafka: {}. Order will still be saved.", e.getMessage());
            // In production, you might want to queue this for retry or use a dead letter queue
        }
    }
}