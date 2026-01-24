package com.example.geofence_service.repository;

import com.example.geofence_service.model.RiderLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface RiderLocationRepository extends JpaRepository<RiderLocation, Long> {

    @Query(value = """
        SELECT * FROM rider_location 
        WHERE is_available = true 
        AND ST_DWithin(current_position, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326), 5000)
        ORDER BY ST_Distance(current_position, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)) ASC
        LIMIT 5
    """, nativeQuery = true)
    List<RiderLocation> findNearbyRiders(@Param("lat") double lat, @Param("lng") double lng);
}
