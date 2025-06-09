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
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;
import java.util.List;

@Component
public class Filter extends OncePerRequestFilter {

    private final TokenService tokenService;
    private final HandlerExceptionResolver resolver;
    private final AuthenticationService authenticationService;
    private final AntPathMatcher antPathMatcher; // Thêm AntPathMatcher để dùng lại

    // Danh sách các API công khai (không cần xác thực)
    // Cấu trúc: "PHUONG_THUC:/duong/dan/api"
    private final List<String> PUBLIC_API = List.of(
            "POST:/api/register",
            "POST:/api/login",
            // THÊM CÁC API GET CÔNG KHAI KHÁC CỦA BẠN TẠI ĐÂY NẾU CÓ.
            // VÍ DỤ: "GET:/api/products", "GET:/api/categories/*"
            // ĐỪNG BAO GỒM "GET:/**" VÌ ĐÓ LÀ LỖ HỔNG BẢO MẬT
            "GET:/api/swagger-ui/**", // Cho phép truy cập Swagger UI
            "GET:/v3/api-docs/**"    // Cho phép truy cập OpenAPI docs
            // ĐÃ LOẠI BỎ "GET:/api/profile" và "PATCH:/api/profile" KHỎI PUBLIC_API.
            // CHÚNG SẼ YÊU CẦU XÁC THỰC VÀ PHẢI ĐƯỢC CẤP QUYỀN TRONG SecurityConfig.java.
    );

    @Autowired
    public Filter(TokenService tokenService,
                  HandlerExceptionResolver handlerExceptionResolver,
                  AuthenticationService authenticationService) {
        this.tokenService = tokenService;
        this.resolver = handlerExceptionResolver;
        this.authenticationService = authenticationService;
        this.antPathMatcher = new AntPathMatcher(); // Khởi tạo AntPathMatcher
    }

    /**
     * Kiểm tra xem một URI và phương thức có phải là API công khai không.
     * @param uri URI của request (ví dụ: /api/register)
     * @param method Phương thức HTTP của request (ví dụ: POST, GET)
     * @return true nếu là API công khai, false nếu không.
     */
    public boolean isPublicAPI(String uri, String method) {
        return PUBLIC_API.stream().anyMatch(pattern -> {
            String[] parts = pattern.split(":", 2);
            if (parts.length != 2) return false;

            String allowedMethod = parts[0];
            String allowedUri = parts[1];

            return method.equalsIgnoreCase(allowedMethod) && antPathMatcher.match(allowedUri, uri);
        });
    }

    /**
     * Trích xuất token JWT từ header Authorization của request.
     * @param request HttpServletRequest.
     * @return Chuỗi token hoặc null nếu không tìm thấy.
     */
    public String getToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        return authHeader.substring(7); // Loại bỏ tiền tố "Bearer "
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String uri = request.getRequestURI();
        String method = request.getMethod();

        // 1. Xử lý yêu cầu OPTIONS (preflight requests) ĐẦU TIÊN
        if (HttpMethod.OPTIONS.matches(method)) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Kiểm tra xem có phải là API công khai không
        if (isPublicAPI(uri, method)) {
            filterChain.doFilter(request, response);
            return;
        } else {
            // 3. Đây là API cần xác thực, tiến hành kiểm tra token
            String token = getToken(request);

            // Nếu không có token
            if (token == null || token.isEmpty()) {
                resolver.resolveException(request, response, null, new AuthenticationException("Token is missing!"));
                return;
            }

            // 4. Có token, tiến hành xác thực token
            User userFromToken;
            try {
                // Từ token tìm ra đối tượng User (tokenService.extractAccount trả về User)
                userFromToken = tokenService.extractAccount(token);
            } catch (ExpiredJwtException expiredJwtException) {
                // Token hết hạn
                resolver.resolveException(request, response, null, new AuthenticationException("Expired Token!"));
                return;
            } catch (MalformedJwtException malformedJwtException) {
                // Token không hợp lệ (sai định dạng, chữ ký)
                resolver.resolveException(request, response, null, new AuthenticationException("Invalid Token!"));
                return;
            } catch (IllegalArgumentException illegalArgumentException) {
                // Token null hoặc trống khi parse (lỗi này hiếm xảy ra nếu getToken() đã kiểm tra)
                resolver.resolveException(request, response, null, new AuthenticationException("Token content is null or empty!"));
                return;
            } catch (Exception e) {
                // Bắt các lỗi chung khác khi trích xuất tài khoản từ token
                // Điều này có thể xảy ra nếu TokenService.extractAccount có lỗi khác
                resolver.resolveException(request, response, null, new AuthenticationException("Error processing token: " + e.getMessage()));
                return;
            }

            // 5. Nếu userFromToken là null (ví dụ: không tìm thấy người dùng từ username trong token payload)
            if (userFromToken == null || userFromToken.getUsername() == null) {
                resolver.resolveException(request, response, null, new AuthenticationException("User from token not found or invalid username!"));
                return;
            }

            // 6. Nếu token hợp lệ và có người dùng, tải UserDetails đầy đủ và đặt vào SecurityContext
            // Chỉ đặt Authentication nếu SecurityContextHolder chưa có (tránh ghi đè hoặc đặt lại)
            if (SecurityContextHolder.getContext().getAuthentication() == null || !(SecurityContextHolder.getContext().getAuthentication().getPrincipal() instanceof UserDetails)) {

                UserDetails userDetails = null;
                try {
                    // TẢI THÔNG TIN NGƯỜI DÙNG ĐẦY ĐỦ BAO GỒM QUYỀN HẠN TỪ UserDetailsService
                    // Sử dụng username từ đối tượng userFromToken để tải UserDetails
                    userDetails = authenticationService.loadUserByUsername(userFromToken.getUsername());
                } catch (org.springframework.security.core.userdetails.UsernameNotFoundException e) {
                    // Người dùng không tồn tại trong DB dù token có username
                    resolver.resolveException(request, response, null, new AuthenticationException("User not found via UserDetailsService!"));
                    return;
                } catch (Exception e) {
                    resolver.resolveException(request, response, null, new AuthenticationException("Error loading user details: " + e.getMessage()));
                    return;
                }

                if (userDetails == null) {
                    resolver.resolveException(request, response, null, new AuthenticationException("User details could not be loaded!"));
                    return;
                }

                // Tạo đối tượng xác thực với UserDetails (principal), null password, và QUYỀN HẠN
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, // SỬ DỤNG userDetails làm principal để có đầy đủ thông tin và quyền hạn
                        null,        // Mật khẩu là null vì đã xác thực qua token
                        userDetails.getAuthorities() // LẤY QUYỀN HẠN TỪ UserDetails
                );
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }

            // 7. Token OK, cho phép request tiếp tục vào Controller
            filterChain.doFilter(request, response);
        }
    }
}
