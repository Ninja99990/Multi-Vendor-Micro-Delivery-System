-- 1. Enable the PostGIS extension (The most critical step)
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Create the Vendor table manually if not using Hibernate ddl-auto
-- We include a GIST index which is the secret to high-speed map searches
CREATE TABLE IF NOT EXISTS vendor (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    is_open BOOLEAN DEFAULT true,
    location GEOMETRY(Point, 4326) -- SRID 4326 = GPS Coordinates
);

-- 3. Create a Spatial Index (GIST)
-- Without this, radius searches will be slow as the database grows
CREATE INDEX IF NOT EXISTS vendor_location_idx ON vendor USING GIST (location);

-- 4. Seed Dummy Data (Bengaluru, India coordinates as an example)
-- Note: ST_SetSRID(ST_Point(Longitude, Latitude), 4326)
INSERT INTO vendor (name, category, is_open, location) VALUES 
('The Zenitsu Cafe', 'Healthy', true, ST_SetSRID(ST_Point(77.5946, 12.9716), 4326)),
('Silicon Bistro', 'Continental', true, ST_SetSRID(ST_Point(77.6000, 12.9800), 4326)),
('Green Leaf Salads', 'Organic', true, ST_SetSRID(ST_Point(77.5800, 12.9600), 4326)),
('Java Junction', 'Coffee', false, ST_SetSRID(ST_Point(77.6100, 12.9900), 4326)),
('Micro-Delivery Hub', 'General', true, ST_SetSRID(ST_Point(77.6200, 13.0000), 4326));