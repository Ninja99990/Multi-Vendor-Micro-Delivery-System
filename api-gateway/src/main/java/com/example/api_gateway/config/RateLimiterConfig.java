package com.example.api_gateway.config;

import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import reactor.core.publisher.Mono;

import java.util.Optional;

// Temporarily disabled due to Redis auto-configuration issues in Spring Boot 4.0.1
// @Configuration
public class RateLimiterConfig {

    /**
     * Standard KeyResolver: Uses the Client's IP Address.
     * This ensures that one IP cannot flood your services.
     */
    @Bean
    @Primary
    public KeyResolver ipKeyResolver() {
        return exchange -> Mono.just(
            Optional.ofNullable(exchange.getRequest().getRemoteAddress())
                .map(address -> address.getAddress().getHostAddress())
                .orElse("unknown")
        );
    }

    /**
     * Alternative KeyResolver: Uses a User ID from a header.
     * Useful once you implement Login/JWT.
     */
    @Bean
    public KeyResolver userKeyResolver() {
        return exchange -> Mono.justOrEmpty(
            exchange.getRequest().getHeaders().getFirst("X-User-Id")
        ).defaultIfEmpty("anonymous");
    }
}