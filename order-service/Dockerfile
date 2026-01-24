# Stage 1: Build Stage
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# 1. Cache dependencies to speed up subsequent builds
COPY pom.xml .
RUN mvn dependency:go-offline

# 2. Copy source and build the JAR
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime Stage (Lightweight)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# 3. Security: Run as a non-root user
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# 4. Copy only the compiled JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# 5. Port 8082 for the Order Service
EXPOSE 8082

# 6. Optimize for Java 21 Virtual Threads and low latency
ENTRYPOINT ["java", "-XX:+UseZGC", "-jar", "app.jar"]