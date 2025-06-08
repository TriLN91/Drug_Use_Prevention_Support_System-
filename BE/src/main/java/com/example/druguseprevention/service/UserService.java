package com.example.druguseprevention.service;

import com.example.druguseprevention.dto.ProfileDTO;
import com.example.druguseprevention.entity.User;
import com.example.druguseprevention.enums.Gender;
import com.example.druguseprevention.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
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
        if (dto.getDateOfBirth() != null) {
            user.setDateOfBirth(LocalDate.parse(dto.getDateOfBirth()));
        }
        if (dto.getGender() != null) {
            user.setGender(Gender.valueOf(dto.getGender()));
        }
        userRepository.save(user);
    }
}
