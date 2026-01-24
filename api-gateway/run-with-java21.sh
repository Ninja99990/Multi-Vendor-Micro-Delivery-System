#!/bin/bash

# Script to run API Gateway with Java 21
export JAVA_HOME=/opt/homebrew/opt/openjdk@21
export PATH="$JAVA_HOME/bin:$PATH"

echo "Using Java:"
java -version

echo ""
echo "Starting API Gateway..."
cd "$(dirname "$0")"
./mvnw spring-boot:run
