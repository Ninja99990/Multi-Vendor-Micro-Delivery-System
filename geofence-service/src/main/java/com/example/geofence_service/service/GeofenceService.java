package com.example.geofence_service.service;

import com.example.geofence_service.dto.OrderEvent;
import com.example.geofence_service.model.RiderLocation;
import com.example.geofence_service.repository.RiderLocationRepository;
import com.example.geofence_service.util.DistanceCalculator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class GeofenceService {

    private final RiderLocationRepository riderLocationRepository;
    private final RestTemplate restTemplate;

    @Value("${order.service.url:http://localhost:8082}")
    private String orderServiceUrl;

    /**
     * Processes the order by finding eligible riders within a 5km radius and assigns the closest one.
     */
    public void processOrderGeofence(OrderEvent event) {
        log.info("Processing Geofence for Order: {} at Vendor Location [{}, {}]", 
                 event.getOrderNumber(), event.getVendorLat(), event.getVendorLng());

        // Only process PLACED orders (ignore status updates)
        if (event.getStatus() != null && !event.getStatus().equals("PLACED")) {
            log.debug("Skipping order {} with status {}", event.getOrderNumber(), event.getStatus());
            return;
        }

        // 1. Execute the Spatial Query (ST_DWithin logic from Repository)
        // Results are already ordered by distance (closest first)
        List<RiderLocation> nearbyRiders = riderLocationRepository.findNearbyRiders(
                event.getVendorLat(), 
                event.getVendorLng()
        );

        if (nearbyRiders.isEmpty()) {
            log.warn("No available riders found within 5km for Order: {}", event.getOrderNumber());
            return;
        }

        // 2. Get the closest rider (first in the sorted list)
        RiderLocation closestRider = nearbyRiders.get(0);
        
        // 3. Calculate distance and ETA
        double distanceKm = DistanceCalculator.calculateDistance(
            event.getVendorLat(), event.getVendorLng(),
            closestRider.getCurrentPosition().getY(), 
            closestRider.getCurrentPosition().getX()
        );
        int etaMinutes = DistanceCalculator.calculateETA(distanceKm);

        log.info("Found {} available riders for Order: {}. Closest: Rider {} at {:.2f}km (ETA: {} min)", 
                 nearbyRiders.size(), event.getOrderNumber(), closestRider.getRiderId(), distanceKm, etaMinutes);

        // 4. Assign rider to order via Order Service API
        try {
            assignRiderToOrder(event, closestRider.getRiderId(), distanceKm, etaMinutes);
        } catch (Exception e) {
            log.error("Failed to assign rider {} to order {}: {}", 
                     closestRider.getRiderId(), event.getOrderNumber(), e.getMessage());
        }
    }

    private void assignRiderToOrder(OrderEvent event, Long riderId, double distanceKm, int etaMinutes) {
        String orderNumber = event.getOrderNumber();
        
        try {
            // Find order by order number to get the ID
            String findOrderUrl = orderServiceUrl + "/api/orders/order-number/" + orderNumber;
            @SuppressWarnings("unchecked")
            Map<String, Object> orderResponse = restTemplate.getForObject(findOrderUrl, Map.class);
            
            if (orderResponse != null && orderResponse.containsKey("id")) {
                Object idObj = orderResponse.get("id");
                Long orderId;
                if (idObj instanceof Number) {
                    orderId = ((Number) idObj).longValue();
                } else {
                    orderId = Long.parseLong(idObj.toString());
                }
                
                // Assign rider
                String assignUrl = orderServiceUrl + "/api/orders/" + orderId + "/assign-rider/" + riderId;
                restTemplate.put(assignUrl, null);
                
                log.info("Successfully assigned Rider {} to Order {} (Distance: {:.2f}km, ETA: {} min)", 
                         riderId, orderNumber, distanceKm, etaMinutes);
            } else {
                log.warn("Could not find order {} to assign rider", orderNumber);
            }
        } catch (Exception e) {
            log.error("Error assigning rider to order {}: {}", orderNumber, e.getMessage(), e);
            // Don't throw - allow system to continue even if assignment fails
        }
    }
}
