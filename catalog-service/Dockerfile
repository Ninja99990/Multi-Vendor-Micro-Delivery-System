# Stage 1: Build Stage
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy the pom.xml and download dependencies (cached layer)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the source code and build the application
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime Stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Add a non-root user for security 
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy the compiled jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the internal port
EXPOSE 8081

# Optimize for Virtual Threads and low memory footprint
ENTRYPOINT ["java", "-XX:+UseZGC", "-jar", "app.jar"]