package com.example.api_gateway.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * Workaround configuration to help with Spring Boot 4.0.1 compatibility
 * This provides basic WebClient for manual routing if needed
 */
@Configuration
public class GatewayWorkaroundConfig {

    @Bean
    @ConditionalOnMissingBean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }
}
