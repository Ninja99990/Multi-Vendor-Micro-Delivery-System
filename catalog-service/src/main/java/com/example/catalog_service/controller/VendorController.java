package com.example.catalog_service.controller;

import com.example.catalog_service.dto.VendorRequest;
import com.example.catalog_service.dto.VendorResponse;
import com.example.catalog_service.model.Vendor;
import com.example.catalog_service.service.VendorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/catalog/vendors")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allows your React app to connect
public class VendorController {

    private final VendorService vendorService;

    /**
     * Search for vendors near a specific point.
     * Example: GET /api/catalog/vendors/nearby?lng=77.59&lat=12.97&radius=5000
     */
    @GetMapping("/nearby")
    public ResponseEntity<List<VendorResponse>> getNearbyVendors(
            @RequestParam double lng,
            @RequestParam double lat,
            @RequestParam(defaultValue = "5000") double radius) {

        List<Vendor> vendors = vendorService.getNearbyVendors(lng, lat, radius);

        // Convert Entities to clean DTOs for the frontend
        List<VendorResponse> response = vendors.stream()
                .map(v -> new VendorResponse(
                        v.getId(),
                        v.getName(),
                        v.getCategory(),
                        v.getLocation().getY(), // Latitude
                        v.getLocation().getX(), // Longitude
                        v.isOpen()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<VendorResponse> createVendor(@Valid @RequestBody VendorRequest request) {
        Vendor savedVendor = vendorService.saveVendor(request);
        
        return ResponseEntity.ok(new VendorResponse(
            savedVendor.getId(),
            savedVendor.getName(),
            savedVendor.getCategory(),
            savedVendor.getLocation().getY(),
            savedVendor.getLocation().getX(),
            savedVendor.isOpen()
        ));
    }
}