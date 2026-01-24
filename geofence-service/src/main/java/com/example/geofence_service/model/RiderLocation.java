package com.example.geofence_service.model;

import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Point;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiderLocation {
    @Id
    private Long riderId;

    @Column(columnDefinition = "geometry(Point, 4326)")
    private Point currentPosition;

    private boolean isAvailable;
}