package com.example.order_service.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI orderServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Order Service API")
                        .description("API for managing delivery orders in the Multi-Vendor Micro-Delivery System")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Delivery System Team")
                                .email("support@deliverysystem.com")));
    }
}
