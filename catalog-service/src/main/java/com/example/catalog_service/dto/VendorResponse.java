package com.example.catalog_service.dto;

public record VendorResponse(
    Long id,
    String name,
    String category,
    double latitude,
    double longitude,
    boolean isOpen
) {} 