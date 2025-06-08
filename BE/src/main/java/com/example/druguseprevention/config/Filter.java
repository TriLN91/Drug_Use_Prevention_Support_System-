package com.example.druguseprevention.config;

import com.example.druguseprevention.exception.AuthenticationException;
import com.example.druguseprevention.service.AuthenticationService;
import com.example.druguseprevention.service.TokenService;
import com.example.druguseprevention.entity.User; // Import lớp User
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;

@Component
public class Filter extends OncePerRequestFilter {

    private final TokenService tokenService;
    private final HandlerExceptionResolver resolver;
    private final AuthenticationService authenticationService;

    @Autowired
    public Filter(TokenService tokenService,
                  HandlerExceptionResolver handlerExceptionResolver,
                  AuthenticationService authenticationService) {
        this.tokenService = tokenService;
        this.resolver = handlerExceptionResolver;
        this.authenticationService = authenticationService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        // QUAN TRỌNG: Nếu yêu cầu là một OPTIONS request (preflight), cho phép nó đi qua ngay lập tức
        if (HttpMethod.OPTIONS.matches(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = getToken(request);

        // Kiểm tra nếu đường dẫn yêu cầu là /api/login hoặc /api/register
        if (request.getRequestURI().startsWith("/api/login") || request.getRequestURI().startsWith("/api/register")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Nếu không có token (và không phải OPTIONS, login, register)
        if (token == null || token.isEmpty()) {
            this.resolver.resolveException(request, response, null, new AuthenticationException("Token is missing!"));
            return;
        }

        try {
            // SỬA ĐỔI: tokenService.extractAccount(token) trả về đối tượng User.
            // Lấy đối tượng User từ token
            User userFromToken = tokenService.extractAccount(token);

            // Kiểm tra nếu đối tượng user hợp lệ từ token và chưa có xác thực trong SecurityContextHolder
            if (userFromToken != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // TẢI THÔNG TIN NGƯỜI DÙNG ĐẦY ĐỦ BAO GỒM QUYỀN HẠN TỪ UserDetailsService
                // Sử dụng username từ đối tượng userFromToken để tải UserDetails
                UserDetails userDetails = authenticationService.loadUserByUsername(userFromToken.getUsername());

                // Tạo đối tượng xác thực với UserDetails (principal), null password, và QUYỀN HẠN
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, // Sử dụng userDetails làm principal để có đầy đủ thông tin người dùng
                        null, // Mật khẩu là null vì đã xác thực qua token
                        userDetails.getAuthorities() // LẤY QUYỀN HẠN TỪ UserDetails
                );
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }

        } catch (ExpiredJwtException e) {
            this.resolver.resolveException(request, response, null, new AuthenticationException("Expired Token!"));
            return;
        } catch (MalformedJwtException e) {
            this.resolver.resolveException(request, response, null, new AuthenticationException("Invalid Token!"));
            return;
        } catch (IllegalArgumentException e) {
            this.resolver.resolveException(request, response, null, new AuthenticationException("Token is null or empty!"));
            return;
        } catch (org.springframework.security.core.userdetails.UsernameNotFoundException e) {
            this.resolver.resolveException(request, response, null, new AuthenticationException("User not found from token!"));
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String getToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }

        return authHeader.substring(7); // Loại bỏ tiền tố "Bearer "
    }
}
