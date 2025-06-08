package com.example.druguseprevention.config;

import com.example.druguseprevention.exception.AuthenticationException;
import com.example.druguseprevention.service.TokenService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;

@Component
public class Filter extends OncePerRequestFilter {

    private final TokenService tokenService;
    private final HandlerExceptionResolver resolver;

    // Use constructor injection for TokenService and HandlerExceptionResolver
    // Spring will automatically inject these dependencies
    @Autowired
    public Filter(TokenService tokenService, HandlerExceptionResolver handlerExceptionResolver) {
        this.tokenService = tokenService;
        this.resolver = handlerExceptionResolver;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String token = getToken(request);

        // Check if the request path is for /api/login or /api/register
        // If it is, we don't need to perform token validation, so let the request proceed
        if (request.getRequestURI().startsWith("/api/login") || request.getRequestURI().startsWith("/api/register")) {
            filterChain.doFilter(request, response);
            return; // Exit the filter chain for these paths
        }

        if (token == null || token.isEmpty()) {
            // Use the injected resolver to handle the exception
            this.resolver.resolveException(request, response, null, new AuthenticationException("Token is missing!"));
            return;
        }

        try {
            // Extract account from token and set authentication in SecurityContextHolder
            String account = String.valueOf(tokenService.extractAccount(token));

            if (account != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        account, null, null
                );
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }

        } catch (ExpiredJwtException e) {
            // Handle expired token exception
            this.resolver.resolveException(request, response, null, new AuthenticationException("Expired Token!"));
            return;
        } catch (MalformedJwtException e) {
            // Handle invalid token exception
            this.resolver.resolveException(request, response, null, new AuthenticationException("Invalid Token!"));
            return;
        } catch (IllegalArgumentException e) {
            // Handle null or empty token exception
            this.resolver.resolveException(request, response, null, new AuthenticationException("Token is null or empty!"));
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String getToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }

        return authHeader.substring(7); // Remove "Bearer " prefix
    }
}
