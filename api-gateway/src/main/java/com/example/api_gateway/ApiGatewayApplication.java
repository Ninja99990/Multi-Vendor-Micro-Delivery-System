package com.example.api_gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(excludeName = {
    "org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration",
    "org.springframework.boot.autoconfigure.data.redis.RedisReactiveAutoConfiguration",
    "org.springframework.cloud.gateway.config.GatewayRedisAutoConfiguration"
})
// Using Spring Boot 3.3.0 with Java 21 for compatibility with Spring Cloud Gateway
public class ApiGatewayApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApiGatewayApplication.class, args);
	}

}
