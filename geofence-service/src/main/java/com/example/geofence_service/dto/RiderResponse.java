package com.example.geofence_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RiderResponse {
    private Long riderId;
    private double distance;
}
