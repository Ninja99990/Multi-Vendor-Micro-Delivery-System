package com.example.catalog_service.service;

import com.example.catalog_service.dto.VendorRequest;
import com.example.catalog_service.model.Vendor;
import com.example.catalog_service.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VendorService {

    private final VendorRepository vendorRepository;
    private final GeometryFactory geometryFactory;

    public List<Vendor> getNearbyVendors(double lng, double lat, double radius) {
        // Create a spatial Point from raw coordinates
        // Note: JTS uses (Longitude, Latitude) order!
        Point userLocation = geometryFactory.createPoint(new Coordinate(lng, lat));
        
        return vendorRepository.findNearbyVendors(userLocation, radius);
    }

    public Vendor saveVendor(VendorRequest request) {
        // Convert latitude/longitude to JTS Point
        // Note: JTS uses (Longitude, Latitude) order!
        Point location = geometryFactory.createPoint(new Coordinate(request.longitude(), request.latitude()));
        
        // Create Vendor entity
        Vendor vendor = Vendor.builder()
                .name(request.name())
                .category(request.category())
                .location(location)
                .isOpen(request.isOpen())
                .build();
        
        // Save and return
        return vendorRepository.save(vendor);
    }
}