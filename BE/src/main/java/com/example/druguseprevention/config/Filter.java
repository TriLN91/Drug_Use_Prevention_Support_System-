package com.example.druguseprevention.config;

import com.example.druguseprevention.exception.AuthenticationException; // Đảm bảo đây là exception tùy chỉnh của bạn
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
import org.springframework.security.core.userdetails.UserDetails; // Import UserDetails
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

    // Danh sách các API công khai (không cần xác thực)
    // Cấu trúc: "PHUONG_THUC:/duong/dan/api"
    private final List<String> PUBLIC_API = List.of(
            "POST:/api/register",
            "POST:/api/login"
            // Thêm các API GET công khai khác tại đây nếu có, ví dụ:
            // "GET:/api/products",
            // "GET:/api/categories/*"
    );

    @Autowired // Sử dụng constructor injection, là cách được khuyến nghị bởi Spring
    public Filter(TokenService tokenService,
                  HandlerExceptionResolver handlerExceptionResolver,
                  AuthenticationService authenticationService) {
        this.tokenService = tokenService;
        this.resolver = handlerExceptionResolver;
        this.authenticationService = authenticationService;
    }

    /**
     * Kiểm tra xem một URI và phương thức có phải là API công khai không.
     * Sử dụng AntPathMatcher để hỗ trợ wildcard.
     * @param uri URI của request (ví dụ: /api/register)
     * @param method Phương thức HTTP của request (ví dụ: POST, GET)
     * @return true nếu là API công khai, false nếu không.
     */
    public boolean isPublicAPI(String uri, String method) {
        AntPathMatcher matcher = new AntPathMatcher();

        // Kiểm tra xem request có khớp với bất kỳ pattern nào trong PUBLIC_API không
        return PUBLIC_API.stream().anyMatch(pattern -> {
            String[] parts = pattern.split(":", 2);
            if (parts.length != 2) return false; // Định dạng pattern không đúng

            String allowedMethod = parts[0];
            String allowedUri = parts[1];

            return method.equalsIgnoreCase(allowedMethod) && matcher.match(allowedUri, uri);
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

        // QUAN TRỌNG: Xử lý riêng biệt cho yêu cầu OPTIONS (preflight request).
        // Yêu cầu OPTIONS không chứa Authorization header và phải được cho phép đi qua
        // để trình duyệt có thể gửi yêu cầu thực tế.
        if (HttpMethod.OPTIONS.matches(method)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Kiểm tra xem có phải là API công khai không
        if (isPublicAPI(uri, method)) {
            filterChain.doFilter(request, response);
            return;
        } else {
            // Đây là API cần xác thực, tiến hành kiểm tra token
            String token = getToken(request);

            // Nếu không có token
            if (token == null || token.isEmpty()) {
                resolver.resolveException(request, response, null, new AuthenticationException("Token is missing!"));
                return;
            }

            // Có token, tiến hành xác thực token
            User userFromToken;
            try {
                // Từ token tìm ra đối tượng User (TokenService.extractAccount trả về User)
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
                // Token null hoặc trống khi parse
                resolver.resolveException(request, response, null, new AuthenticationException("Token is null or empty in payload!"));
                return;
            } catch (Exception e) {
                // Bắt các lỗi chung khác khi trích xuất tài khoản từ token
                resolver.resolveException(request, response, null, new AuthenticationException("Error extracting account from token: " + e.getMessage()));
                return;
            }

            // Nếu userFromToken là null (ví dụ: không tìm thấy người dùng từ username trong token)
            if (userFromToken == null) {
                resolver.resolveException(request, response, null, new AuthenticationException("User from token not found in database!"));
                return;
            }

            // Nếu token hợp lệ và có người dùng, tải UserDetails đầy đủ và đặt vào SecurityContext
            if (SecurityContextHolder.getContext().getAuthentication() == null) {
                // TẢI THÔNG TIN NGƯỜI DÙNG ĐẦY ĐỦ BAO GỒM QUYỀN HẠN TỪ UserDetailsService
                UserDetails userDetails = authenticationService.loadUserByUsername(userFromToken.getUsername());

                // Nếu userDetails là null (người dùng không tồn tại trong DB dù token hợp lệ)
                if (userDetails == null) {
                    resolver.resolveException(request, response, null, new AuthenticationException("User not found via UserDetailsService!"));
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

            // Token OK, cho phép request tiếp tục vào Controller
            filterChain.doFilter(request, response);
        }
    }
}
