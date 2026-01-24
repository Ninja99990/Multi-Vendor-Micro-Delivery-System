#!/bin/bash
# Build script for geofence-service using Java 21
export JAVA_HOME=/opt/homebrew/opt/openjdk@21
./mvnw "$@"
