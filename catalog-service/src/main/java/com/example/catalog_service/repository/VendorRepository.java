package com.example.catalog_service.repository;

import com.example.catalog_service.model.Vendor;
import org.locationtech.jts.geom.Point;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {

    /**
     * Finds vendors within a specific radius of a user's location.
     * * @param userLocation The JTS Point representing user's current GPS coords.
     * @param radiusInMeters Distance in meters (PostGIS geometry defaults to degrees, 
     * but ST_DWithin handles geography/geometry context).
     * @return List of vendors within the circular "fence".
     */
    @Query(value = """
        SELECT * FROM vendor v 
        WHERE ST_DWithin(v.location, :userLocation, :radiusInMeters) = true
        ORDER BY ST_Distance(v.location, :userLocation) ASC
        """, nativeQuery = true)
    List<Vendor> findNearbyVendors(
        @Param("userLocation") Point userLocation, 
        @Param("radiusInMeters") double radiusInMeters
    );
}