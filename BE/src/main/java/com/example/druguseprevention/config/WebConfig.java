package com.example.druguseprevention.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**") // Áp dụng CORS cho tất cả các endpoint dưới /api/
                        .allowedOrigins("http://localhost:5173") // <-- Đảm bảo chính xác
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH") // <-- OPTIONS phải có
                        .allowedHeaders("*") // Cho phép tất cả các header (bao gồm Authorization)
                        .allowCredentials(true); // Quan trọng nếu bạn gửi cookie hoặc header Authorization
            }
        };
    }
}