package com.example.geofence_service.controller;

import com.example.geofence_service.model.RiderLocation;
import com.example.geofence_service.repository.RiderLocationRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/riders")
@RequiredArgsConstructor
public class RiderLocationController {

    private final RiderLocationRepository repository;
    private final GeometryFactory geometryFactory;

    @PostMapping("/{riderId}/location")
    public ResponseEntity<String> updateLocation(
            @PathVariable Long riderId,
            @RequestParam double lat,
            @RequestParam double lng) {

        // Create a JTS Point from the coordinates
        Point position = geometryFactory.createPoint(new Coordinate(lng, lat));

        RiderLocation riderLocation = repository.findById(riderId)
                .orElse(new RiderLocation());
        
        riderLocation.setRiderId(riderId);
        riderLocation.setCurrentPosition(position);
        riderLocation.setAvailable(true); // Assuming they are ready for orders

        repository.save(riderLocation);

        return ResponseEntity.ok("Rider location updated successfully");
    }

    @GetMapping("/locations")
    public ResponseEntity<List<RiderLocationDTO>> getAllRiderLocations() {
        List<RiderLocation> riders = repository.findAll();
        List<RiderLocationDTO> dtos = riders.stream()
                .filter(r -> r.getCurrentPosition() != null && r.isAvailable())
                .map(r -> {
                    Point pos = r.getCurrentPosition();
                    return new RiderLocationDTO(
                            r.getRiderId(),
                            pos.getY(), // latitude
                            pos.getX(), // longitude
                            r.isAvailable()
                    );
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @Data
    @AllArgsConstructor
    static class RiderLocationDTO {
        private Long riderId;
        private double lat;
        private double lng;
        private boolean available;
    }
}
