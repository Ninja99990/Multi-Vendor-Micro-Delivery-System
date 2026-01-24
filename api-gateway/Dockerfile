# Stage 1: Build Stage
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Build the application
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime Stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Non-root user for security (Teetotaler/Clean Engineering)
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy the compiled jar
COPY --from=build /app/target/*.jar app.jar

# Expose the entry port (8080 is our standard gateway port)
EXPOSE 8080

# Configure for Reactive performance
# We use G1GC or ZGC for low latency in the gateway
ENTRYPOINT ["java", "-XX:+UseZGC", "-jar", "app.jar"]