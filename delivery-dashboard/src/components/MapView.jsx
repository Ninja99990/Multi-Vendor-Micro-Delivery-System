import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Create custom vendor icon (Store/Shopping Bag - Blue)
const createVendorIcon = () => {
  return L.divIcon({
    className: 'custom-vendor-icon',
    html: `
      <div style="
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        width: 40px;
        height: 40px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
        border: 3px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-size: 18px;
          font-weight: bold;
          text-align: center;
          line-height: 1;
        ">🏪</div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

// Create custom rider icon (Bike/Motorcycle - Green)
const createRiderIcon = () => {
  return L.divIcon({
    className: 'custom-rider-icon',
    html: `
      <div style="
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        width: 36px;
        height: 36px;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
        border: 3px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          color: white;
          font-size: 18px;
          font-weight: bold;
          text-align: center;
          line-height: 1;
        ">🏍️</div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

const MapView = ({ vendorLoc, riders }) => {
  const vendorIcon = createVendorIcon();
  const riderIcon = createRiderIcon();

  return (
    <MapContainer center={vendorLoc} zoom={14} className="h-full w-full rounded-xl">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {/* Vendor Location */}
      <Marker position={vendorLoc} icon={vendorIcon}>
        <Popup>
          <div style={{ textAlign: 'center', padding: '4px', minWidth: '120px' }}>
            <div style={{ 
              fontSize: '18px', 
              marginBottom: '4px',
              fontWeight: 'bold',
              color: '#2563eb'
            }}>🏪 Vendor</div>
            <div style={{ 
              fontSize: '12px', 
              color: '#64748b',
              marginBottom: '6px'
            }}>Pickup Point</div>
            <div style={{ 
              fontSize: '11px', 
              color: '#94a3b8',
              borderTop: '1px solid #e2e8f0',
              paddingTop: '6px',
              marginTop: '6px'
            }}>
              Cincinnati, OH
            </div>
          </div>
        </Popup>
      </Marker>

      {/* 5km Geofence visualization */}
      <Circle 
        center={vendorLoc} 
        radius={5000} 
        pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1 }} 
      />

      {/* Active Riders */}
      {riders.map((rider) => (
        <Marker key={rider.id} position={[rider.lat, rider.lng]} icon={riderIcon}>
          <Popup>
            <div style={{ textAlign: 'center', padding: '4px', minWidth: '140px' }}>
              <div style={{ 
                fontSize: '18px', 
                marginBottom: '4px',
                fontWeight: 'bold',
                color: '#059669'
              }}>🏍️ Rider #{rider.id}</div>
              <div style={{ 
                fontSize: '12px', 
                color: '#64748b',
                marginBottom: '6px'
              }}>Available for delivery</div>
              <div style={{ 
                fontSize: '11px', 
                color: '#94a3b8',
                borderTop: '1px solid #e2e8f0',
                paddingTop: '6px',
                marginTop: '6px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span style={{ 
                  width: '8px', 
                  height: '8px', 
                  backgroundColor: '#10b981', 
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'pulse 2s infinite'
                }}></span>
                <span>Online</span>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;