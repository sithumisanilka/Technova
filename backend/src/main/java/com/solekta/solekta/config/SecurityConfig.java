package com.solekta.solekta.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Disable CSRF for API testing
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Enable CORS
                .authorizeHttpRequests(authz -> authz
                        // Allow all cart endpoints
                        .requestMatchers("/api/cart/**").permitAll()
                        // Allow all order endpoints
                        .requestMatchers("/api/orders/**").permitAll()
                        // Allow all payment endpoints
                        .requestMatchers("/api/payments/**").permitAll()
                        // Allow all product endpoints
                        .requestMatchers("/api/products/**").permitAll()
                        // Allow H2 console for development (if using H2)
                        .requestMatchers("/h2-console/**").permitAll()
                        // Allow all other requests (you can restrict this later)
                        .anyRequest().permitAll())
                .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable())); // Disable frame
                                                                                                   // options for H2
                                                                                                   // console

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*")); // Allow all origins
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}
