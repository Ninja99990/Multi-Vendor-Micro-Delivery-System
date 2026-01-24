# API Gateway Startup Issue

## Problem
The API Gateway fails to start with:
```
NoClassDefFoundError: org/springframework/boot/autoconfigure/web/embedded/NettyWebServerFactoryCustomizer
```

## Root Cause
**Version Incompatibility**: Spring Cloud Gateway 4.1.0 is not fully compatible with Spring Boot 4.0.1. The class `NettyWebServerFactoryCustomizer` was removed/renamed in Spring Boot 4.0.1, but Spring Cloud Gateway 4.1.0 still references it.

## Solutions

### Option 1: Downgrade Spring Boot to 3.x (Recommended for stability)
Change `pom.xml`:
```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.3.0</version>  <!-- Change from 4.0.1 -->
</parent>
```

Also update Spring Cloud version:
```xml
<spring-cloud.version>2023.0.0</spring-cloud.version>
```

### Option 2: Wait for compatible Spring Cloud Gateway version
Spring Cloud Gateway 4.1.0 may need an update to support Spring Boot 4.0.1 fully.

### Option 3: Use Spring Cloud Gateway without rate limiting (Current workaround)
- Rate limiting is already disabled
- Redis dependency removed
- Service should work for basic routing without rate limiting

## Current Status
- ✅ Code compiles
- ❌ Service fails to start due to Netty configuration class missing
- ⚠️ This is a framework compatibility issue, not a code issue

## Recommendation
**Downgrade to Spring Boot 3.3.0** for better compatibility with Spring Cloud Gateway 4.1.0, or wait for a Spring Cloud Gateway version that fully supports Spring Boot 4.0.1.
