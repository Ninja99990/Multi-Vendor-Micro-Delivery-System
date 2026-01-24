package com.example.api_gateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.userdetails.MapReactiveUserDetailsService;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Value("${gateway.auth.username:admin}")
    private String username;

    @Value("${gateway.auth.password:admin}")
    private String password;

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Using BCryptPasswordEncoder - encode password when creating user
        return new BCryptPasswordEncoder();
    }

    @Bean
    public MapReactiveUserDetailsService userDetailsService() {
        // Encode the password using BCrypt
        String encodedPassword = passwordEncoder().encode(password);
        UserDetails user = User.builder()
                .username(username)
                .password(encodedPassword)
                .roles("USER")
                .build();
        return new MapReactiveUserDetailsService(user);
    }

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
            .csrf(csrf -> csrf.disable()) // Stateless APIs don't need CSRF
            .authorizeExchange(exchanges -> exchanges
                .pathMatchers("/api/auth/**").permitAll() // Allow login/signup
                .pathMatchers("/fallback/**").permitAll() // Allow fallback pages
                .pathMatchers("/actuator/**").permitAll() // Allow actuator endpoints for monitoring
                .pathMatchers("/api/catalog/**").permitAll() // Temporarily allow catalog service for development
                .pathMatchers("/api/orders/**").permitAll() // Temporarily allow order service for development
                .pathMatchers("/api/riders/**").permitAll() // Temporarily allow geofence service for development
                .anyExchange().authenticated()           // Protect everything else
            )
            .httpBasic(); // Enable Basic Auth
            
        return http.build();
    }
}
