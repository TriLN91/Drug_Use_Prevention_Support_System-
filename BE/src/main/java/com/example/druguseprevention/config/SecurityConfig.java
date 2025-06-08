package com.example.druguseprevention.config;

import com.example.druguseprevention.service.AuthenticationService;
import com.example.druguseprevention.service.TokenService; // Import TokenService nếu chưa có
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.HandlerExceptionResolver; // Import HandlerExceptionResolver nếu chưa có

@Configuration
public class SecurityConfig {

    // BỎ DÒNG NÀY: @Autowired Filter filter; // <-- XÓA DÒNG NÀY ĐỂ KHẮC PHỤC VÒNG LẶP PHỤ THUỘC

    @Autowired
    AuthenticationService authenticationService; // Cần thiết cho userDetailsService và Filter

    @Autowired
    TokenService tokenService; // Cần thiết cho Filter

    @Autowired
    HandlerExceptionResolver handlerExceptionResolver; // Cần thiết cho Filter

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception{
        return configuration.getAuthenticationManager();
    }

    // THÊM BEAN CHO CUSTOM FILTER CỦA BẠN VÀ TIÊM CÁC PHỤ THUỘC CẦN THIẾT
    @Bean
    public Filter jwtAuthenticationFilter() {
        return new Filter(tokenService, handlerExceptionResolver, authenticationService);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable) // Tắt CSRF cho API RESTful
                .authorizeHttpRequests(auth -> auth
                        // Cho phép OPTIONS (preflight requests) trên mọi đường dẫn API
                        .requestMatchers(HttpMethod.OPTIONS, "/api/**").permitAll()
                        // Cho phép PATCH request đến /api/profile cho người dùng đã xác thực
                        .requestMatchers(HttpMethod.PATCH, "/api/profile").authenticated()
                        // QUAN TRỌNG: Kiểm tra lại quy tắc này
                        // Nếu bạn muốn tất cả các API khác yêu cầu xác thực, hãy dùng .anyRequest().authenticated()
                        // .anyRequest().authenticated()
                        // Nếu bạn muốn mọi thứ khác được phép mà không cần xác thực, hãy dùng .anyRequest().permitAll()
                        .anyRequest().permitAll() // <-- Cần xem xét lại quy tắc này tùy thuộc vào yêu cầu bảo mật của bạn
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // SỬ DỤNG BEAN CỦA FILTER Ở ĐÂY
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}
