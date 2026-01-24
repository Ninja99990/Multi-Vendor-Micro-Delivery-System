#!/bin/bash

echo "=========================================="
echo "Frontend-Backend Connection Test"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test Frontend
echo -e "${YELLOW}1. Testing Frontend...${NC}"
if curl -s -o /dev/null -w "%{http_code}" http://localhost:5173 | grep -q "200"; then
    echo -e "${GREEN}✓ Frontend is running on port 5173${NC}"
else
    echo -e "${RED}✗ Frontend is not running${NC}"
fi
echo ""

# Test API Gateway
echo -e "${YELLOW}2. Testing API Gateway...${NC}"
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/actuator/health | grep -q "200"; then
    echo -e "${GREEN}✓ API Gateway is running on port 8080${NC}"
else
    echo -e "${RED}✗ API Gateway is not running${NC}"
fi
echo ""

# Test Order Service
echo -e "${YELLOW}3. Testing Order Service...${NC}"
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8082/actuator/health 2>/dev/null | grep -q "200"; then
    echo -e "${GREEN}✓ Order Service is running on port 8082${NC}"
else
    echo -e "${RED}✗ Order Service is not running${NC}"
fi
echo ""

# Test Catalog Service
echo -e "${YELLOW}4. Testing Catalog Service...${NC}"
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8081/actuator/health 2>/dev/null | grep -q "200"; then
    echo -e "${GREEN}✓ Catalog Service is running on port 8081${NC}"
else
    echo -e "${RED}✗ Catalog Service is not running${NC}"
fi
echo ""

# Test Connection Flow
echo -e "${YELLOW}5. Testing Frontend → API Gateway → Order Service...${NC}"
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/orders/place -X POST \
   -H "Content-Type: application/json" \
   -d '{"customerId":1,"vendorId":55,"totalAmount":450.00,"vendorLat":12.9716,"vendorLng":77.5946}' 2>/dev/null | grep -qE "201|400|500"; then
    echo -e "${GREEN}✓ Connection path is working (got response from backend)${NC}"
else
    echo -e "${RED}✗ Connection path is broken${NC}"
fi
echo ""

echo "=========================================="
echo "Configuration Summary:"
echo "=========================================="
echo "Frontend URL: http://localhost:5173"
echo "API Gateway URL: http://localhost:8080"
echo "Frontend API Base: http://localhost:8080/api"
echo "Order Endpoint: POST /api/orders/place"
echo "CORS: Configured for http://localhost:5173"
echo ""
