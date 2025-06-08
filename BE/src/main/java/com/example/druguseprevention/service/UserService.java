package com.example.druguseprevention.service;

import com.example.druguseprevention.dto.ProfileDTO;
import com.example.druguseprevention.entity.User;
import com.example.druguseprevention.enums.Gender;
import com.example.druguseprevention.repository.UserRepository; // Giả sử UserRepository có findByUsername hoặc là UserRepository chung có findByEmail
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getCurrentUser() {
        // Lấy username của người dùng hiện tại từ SecurityContextHolder
        // .getName() trả về principal name, thường là username sau khi JWT được xác thực
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // SỬA ĐỔI: Tìm người dùng bằng username thay vì email
        // Đảm bảo UserRepository của bạn có phương thức findByUsername(String username)
        return userRepository.findByUsername(username) // <-- Đã thay đổi từ findByEmail sang findByUsername
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username)); // Thêm thông báo chi tiết
    }

    public ProfileDTO getProfile() {
        User user = getCurrentUser();
        ProfileDTO dto = new ProfileDTO();
        dto.setFullName(user.getFullName());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setAddress(user.getAddress());
        dto.setDateOfBirth(user.getDateOfBirth() != null ? user.getDateOfBirth().toString() : null);
        dto.setGender(user.getGender() != null ? user.getGender().toString() : null);
        return dto;
    }

    public void updateProfile(ProfileDTO dto) {
        User user = getCurrentUser();

        user.setFullName(dto.getFullName());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setAddress(dto.getAddress());

        if (StringUtils.hasText(dto.getDateOfBirth())) {
            try {
                user.setDateOfBirth(LocalDate.parse(dto.getDateOfBirth()));
            } catch (DateTimeParseException e) {
                System.err.println("Lỗi parse ngày sinh: " + dto.getDateOfBirth() + " - " + e.getMessage());
            }
        } else {
            user.setDateOfBirth(null);
        }

        if (StringUtils.hasText(dto.getGender())) {
            try {
                user.setGender(Gender.valueOf(dto.getGender()));
            } catch (IllegalArgumentException e) {
                System.err.println("Lỗi chuyển đổi giới tính: " + dto.getGender() + " - " + e.getMessage());
            }
        } else {
            user.setGender(null);
        }

        userRepository.save(user);
    }
}
