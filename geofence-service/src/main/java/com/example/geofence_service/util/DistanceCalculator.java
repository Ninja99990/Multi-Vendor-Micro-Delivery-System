package com.example.geofence_service.util;

import org.locationtech.jts.geom.Point;

/**
 * Utility class for calculating distances between geographic points
 * using the Haversine formula for great-circle distance.
 */
public class DistanceCalculator {

    private static final double EARTH_RADIUS_KM = 6371.0;

    /**
     * Calculate distance between two points in kilometers using Haversine formula
     * @param lat1 Latitude of first point
     * @param lng1 Longitude of first point
     * @param lat2 Latitude of second point
     * @param lng2 Longitude of second point
     * @return Distance in kilometers
     */
    public static double calculateDistance(double lat1, double lng1, double lat2, double lng2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLng / 2) * Math.sin(dLng / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_KM * c;
    }

    /**
     * Calculate distance between two JTS Points
     */
    public static double calculateDistance(Point point1, Point point2) {
        return calculateDistance(
            point1.getY(), point1.getX(),
            point2.getY(), point2.getX()
        );
    }

    /**
     * Calculate estimated time of arrival (ETA) in minutes
     * Assumes average delivery speed of 30 km/h
     * @param distanceKm Distance in kilometers
     * @return ETA in minutes
     */
    public static int calculateETA(double distanceKm) {
        double averageSpeedKmh = 30.0; // Average delivery speed
        double timeHours = distanceKm / averageSpeedKmh;
        return (int) Math.ceil(timeHours * 60); // Convert to minutes and round up
    }

    /**
     * Calculate ETA with custom speed
     * @param distanceKm Distance in kilometers
     * @param speedKmh Speed in km/h
     * @return ETA in minutes
     */
    public static int calculateETA(double distanceKm, double speedKmh) {
        double timeHours = distanceKm / speedKmh;
        return (int) Math.ceil(timeHours * 60);
    }
}
