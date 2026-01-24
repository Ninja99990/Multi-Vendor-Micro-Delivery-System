# Multi-Vendor Micro-Delivery System - Setup & Testing Guide

## Prerequisites

- **Java 21** (or Java 17+) - Check with: `java -version`
- **Maven** - Usually comes with the project (`./mvnw`)
- **Node.js** (v18+) - Check with: `node -v`
- **npm** - Check with: `npm -v`
- **Docker** (for infrastructure) - Check with: `docker --version`

---

## Step 1: Start Infrastructure (Database & Redis)

Open a terminal and navigate to the infra directory:

```bash
cd "/Users/saikarthikkotala/Desktop/Multi-Vendor Micro-Delivery System/infra"
docker-compose up -d
```

This starts:
- **PostgreSQL** (with PostGIS) on port `5432`
- **Redis** on port `6379`

**Verify it's running:**
```bash
docker ps
```

You should see `delivery-db` and `delivery-redis` containers running.

---

## Step 2: Start Backend Services

You'll need **3 separate terminal windows** for the backend services.

### Terminal 1: Catalog Service (Port 8081)

```bash
cd "/Users/saikarthikkotala/Desktop/Multi-Vendor Micro-Delivery System/catalog-service"
./mvnw spring-boot:run
```

Wait for: `Started CatalogServiceApplication` message

### Terminal 2: Order Service (Port 8082)

```bash
cd "/Users/saikarthikkotala/Desktop/Multi-Vendor Micro-Delivery System/order-service"
./mvnw spring-boot:run
```

Wait for: `Started OrderServiceApplication` message

### Terminal 3: API Gateway (Port 8080)

```bash
cd "/Users/saikarthikkotala/Desktop/Multi-Vendor Micro-Delivery System/api-gateway"
./mvnw spring-boot:run
```

Wait for: `Started ApiGatewayApplication` message

**Note:** The API Gateway now requires Basic Authentication:
- **Default Username:** `admin`
- **Default Password:** `admin`

You can change these by setting environment variables:
```bash
export GATEWAY_USERNAME=your_username
export GATEWAY_PASSWORD=your_password
./mvnw spring-boot:run
```

---

## Step 3: Configure Frontend Environment

Navigate to the frontend directory and update the `.env` file:

```bash
cd "/Users/saikarthikkotala/Desktop/Multi-Vendor Micro-Delivery System/delivery-dashboard"
```

Edit the `.env` file and set your credentials:

```env
VITE_API_GATEWAY_URL=http://localhost:8080/api
VITE_API_USERNAME=admin
VITE_API_PASSWORD=admin
```

---

## Step 4: Start Frontend

In a new terminal:

```bash
cd "/Users/saikarthikkotala/Desktop/Multi-Vendor Micro-Delivery System/delivery-dashboard"
npm install  # Only needed first time or after package changes
npm run dev
```

The frontend will start on: **http://localhost:5173**

---

## Step 5: Testing the Application

### 5.1 Test Backend Services Directly

#### Test Catalog Service:
```bash
curl http://localhost:8081/api/catalog/vendors
```

#### Test Order Service:
```bash
curl http://localhost:8082/api/orders/health
```

#### Test API Gateway (with Basic Auth):
```bash
curl -u admin:admin http://localhost:8080/api/catalog/vendors
```

Or using base64 encoded credentials:
```bash
curl -H "Authorization: Basic YWRtaW46YWRtaW4=" http://localhost:8080/api/catalog/vendors
```

### 5.2 Test Frontend Application

1. **Open Browser:** Navigate to `http://localhost:5173`

2. **What to Check:**
   - ✅ Map displays Cincinnati, OH
   - ✅ Vendor marker (blue) at center
   - ✅ 5km geofence circle visible
   - ✅ Two rider markers on the map
   - ✅ "Multi Vendor Micro Delivery System" in navbar
   - ✅ "Gateway Online" status indicator
   - ✅ Control panel shows "Cincinnati, OH" as pickup location

3. **Test Order Placement:**
   - Click the **"Place Order & Find Riders"** button
   - **If API Gateway is running:** You should see a success message with order number
   - **If API Gateway is not running:** You'll see "Failed to connect to Gateway" (expected)

### 5.3 Test API Gateway Health

```bash
curl http://localhost:8080/actuator/health
```

### 5.4 Test Order Placement via API

```bash
curl -X POST http://localhost:8080/api/orders/place \
  -u admin:admin \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "vendorId": 55,
    "totalAmount": 450.00,
    "vendorLat": 39.1031,
    "vendorLng": -84.5120
  }'
```

---

## Troubleshooting

### Backend Services Won't Start

1. **Check Java Version:**
   ```bash
   java -version  # Should be Java 17+
   ```

2. **Check if ports are in use:**
   ```bash
   lsof -i :8080  # API Gateway
   lsof -i :8081  # Catalog Service
   lsof -i :8082  # Order Service
   ```

3. **Check Database Connection:**
   ```bash
   docker ps  # Verify PostgreSQL is running
   ```

### Frontend Shows "Failed to connect to Gateway"

1. **Verify API Gateway is running:**
   ```bash
   curl http://localhost:8080/actuator/health
   ```

2. **Check `.env` file credentials:**
   ```bash
   cat .env
   ```

3. **Restart frontend after changing `.env`:**
   ```bash
   # Stop with Ctrl+C, then:
   npm run dev
   ```

### Map Not Displaying

1. **Check browser console** for errors (F12)
2. **Verify Leaflet CSS is loading**
3. **Check network tab** for failed requests

---

## Service Ports Summary

| Service | Port | URL |
|---------|------|-----|
| Frontend | 5173 | http://localhost:5173 |
| API Gateway | 8080 | http://localhost:8080 |
| Catalog Service | 8081 | http://localhost:8081 |
| Order Service | 8082 | http://localhost:8082 |
| PostgreSQL | 5432 | localhost:5432 |
| Redis | 6379 | localhost:6379 |

---

## Quick Start Commands (All in One)

```bash
# Terminal 1: Infrastructure
cd infra && docker-compose up -d

# Terminal 2: Catalog Service
cd catalog-service && ./mvnw spring-boot:run

# Terminal 3: Order Service
cd order-service && ./mvnw spring-boot:run

# Terminal 4: API Gateway
cd api-gateway && ./mvnw spring-boot:run

# Terminal 5: Frontend
cd delivery-dashboard && npm run dev
```

---

## Stopping Services

- **Frontend:** Press `Ctrl+C` in the terminal
- **Backend Services:** Press `Ctrl+C` in each terminal
- **Infrastructure:** 
  ```bash
  cd infra
  docker-compose down
  ```

---

## Next Steps

- Customize the map location in `src/App.jsx`
- Add more vendors/riders
- Integrate with real authentication
- Deploy to production
