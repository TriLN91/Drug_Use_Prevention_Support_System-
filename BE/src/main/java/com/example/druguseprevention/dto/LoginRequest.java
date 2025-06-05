package com.example.druguseprevention.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String username; // bạn vẫn giữ nếu sau này dùng
    private String email;    // thêm email để xử lý hiện tại
    private String password;
}
