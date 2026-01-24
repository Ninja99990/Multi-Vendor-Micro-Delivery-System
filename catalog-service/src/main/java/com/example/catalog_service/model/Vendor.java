package com.example.catalog_service.model;

import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Point;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vendor {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;

    // 'geometry(Point, 4326)' tells PostGIS to store this as a searchable coordinate
    @Column(columnDefinition = "geometry(Point, 4326)")
    private Point location;

    private boolean isOpen;
}