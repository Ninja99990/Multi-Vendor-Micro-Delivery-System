package com.example.catalog_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record VendorRequest(
    @NotBlank(message = "Vendor name is required")
    String name,
    
    @NotBlank(message = "Category is required")
    String category,
    
    @NotNull(message = "Latitude is required")
    double latitude,
    
    @NotNull(message = "Longitude is required")
    double longitude,
    
    boolean isOpen
) {}