# Multi-Vendor Micro-Delivery System

A real-time microservices-based delivery management system with geofencing, order tracking, and live mesh network visualization.

## 🏗️ Architecture

This system consists of multiple microservices working together:

- **API Gateway** (Port 8080) - Single entry point with routing, circuit breakers, and security
- **Catalog Service** (Port 8081) - Vendor and product catalog management
- **Order Service** (Port 8082) - Order processing and Kafka event publishing
- **Geofence Service** (Port 8083) - Real-time rider location tracking and geofence calculations
- **Delivery Dashboard** (Port 5173) - React-based real-time visualization UI

## 🚀 Quick Start

### Prerequisites

- Java 21
- Node.js 18+
- Docker & Docker Compose
- Maven 3.8+

### 1. Start Infrastructure Services

```bash
cd infra
docker-compose up -d
```

This starts:
- PostgreSQL with PostGIS (Port 5432)
- Redis (Port 6379)
- Kafka + Zookeeper (Ports 9092, 2181)

### 2. Start Microservices

**API Gateway:**
```bash
cd api-gateway
./mvnw spring-boot:run
```

**Order Service:**
```bash
cd order-service
./mvnw spring-boot:run
```

**Geofence Service:**
```bash
cd geofence-service
./mvnw spring-boot:run
```

**Catalog Service:**
```bash
cd catalog-service
./mvnw spring-boot:run
```

### 3. Start Frontend

```bash
cd delivery-dashboard
npm install
npm run dev
```

## 📋 Services Overview

### API Gateway
- Routes: `/api/catalog/**`, `/api/orders/**`, `/api/riders/**`
- Features: Circuit breakers, CORS, security configuration
- Health: `http://localhost:8080/actuator/health`

### Order Service
- Endpoints: `POST /api/orders/place`
- Features: Order creation, Kafka event publishing
- Swagger: `http://localhost:8082/swagger-ui.html` (when configured)

### Geofence Service
- Endpoints: 
  - `POST /api/riders/{riderId}/location` - Update rider location
  - `GET /api/riders/locations` - Get all active rider locations
- Features: Real-time location tracking, Kafka consumer for order events

### Catalog Service
- Endpoints: `GET /api/catalog/vendors/nearby`
- Features: Spatial queries for nearby vendors

## 🗄️ Database

**Connection Details:**
- Host: `localhost:5432`
- Database: `delivery_mesh`
- Username: `teetotaler_admin`
- Password: `clean_code_only`

**Tables:**
- `orders` - Order information
- `rider_location` - Real-time rider positions
- `vendor` - Vendor catalog

## 🔧 Configuration

### Environment Variables

**API Gateway:**
- `CATALOG_SERVICE_URI` - Default: `http://localhost:8081`
- `ORDER_SERVICE_URI` - Default: `http://localhost:8082`
- `GEOFENCE_SERVICE_URI` - Default: `http://localhost:8083`

**Order Service:**
- `KAFKA_SERVERS` - Default: `localhost:9092`
- `SPRING_DATASOURCE_URL` - Database connection string

**Geofence Service:**
- `KAFKA_SERVERS` - Default: `localhost:9092`

## 🧪 Testing

### Test Order Placement

```bash
curl -X POST http://localhost:8080/api/orders/place \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "vendorId": 55,
    "totalAmount": 45.00,
    "vendorLat": 39.1031,
    "vendorLng": -84.5120
  }'
```

### Update Rider Location

```bash
curl -X POST "http://localhost:8080/api/riders/101/location?lat=39.1080&lng=-84.5150"
```

### Get All Rider Locations

```bash
curl http://localhost:8080/api/riders/locations
```

## 🎨 Frontend Features

- **Real-time Map**: Live visualization of vendors and riders
- **Order Placement**: Create orders with automatic rider discovery
- **Live Activity Monitor**: Real-time system status updates
- **Statistics Dashboard**: Active riders, vendor locations, last update time
- **Error Handling**: Toast notifications and error boundaries

## 🔐 Security

Currently configured for development:
- API Gateway has basic authentication (username: `admin`, password: `admin`)
- All `/api/**` endpoints are temporarily permitted
- For production, implement JWT authentication

## 📊 Monitoring

- **Health Checks**: All services expose `/actuator/health`
- **Metrics**: Available via Actuator endpoints
- **Circuit Breakers**: Resilience4j for fault tolerance

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :8080

# Kill process
kill <PID>
```

### Kafka Connection Issues
```bash
# Check if Kafka is running
docker ps | grep kafka

# Check Kafka logs
docker logs delivery-kafka
```

### Database Connection Issues
```bash
# Test database connection
docker exec -it delivery-db psql -U teetotaler_admin -d delivery_mesh
```

## 📚 API Documentation

- **Order Service Swagger**: `http://localhost:8082/swagger-ui.html` (when configured)
- **API Gateway Routes**: Check `application.yml` for route configurations

## 🛠️ Development

### Project Structure
```
.
├── api-gateway/          # Spring Cloud Gateway
├── catalog-service/      # Vendor catalog service
├── order-service/        # Order management service
├── geofence-service/     # Location tracking service
├── delivery-dashboard/   # React frontend
└── infra/               # Docker Compose configuration
```

### Building Services

```bash
# Build all services
cd api-gateway && ./mvnw clean package
cd ../order-service && ./mvnw clean package
cd ../geofence-service && ./mvnw clean package
cd ../catalog-service && ./mvnw clean package
```

## 🚢 Docker Deployment

Each service has a `Dockerfile`. Build and run:

```bash
# Build
docker build -t order-service ./order-service

# Run
docker run -p 8082:8082 order-service
```

## 📝 License

This project is for educational/demonstration purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues or questions, please check the service logs:
- API Gateway: Check console output
- Services: Check `target/` directory logs
- Frontend: Check browser console

---

**Built with:** Spring Boot, React, PostgreSQL, Kafka, Docker
