package com.example.druguseprevention.service;

import com.example.druguseprevention.dto.ProfileDTO;
import com.example.druguseprevention.exception.ResourceNotFoundException;
import com.example.druguseprevention.entity.User;
import com.example.druguseprevention.entity.Profile;
import com.example.druguseprevention.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class ProfileServiceImpl implements ProfileService { // ✅ implement interface

    private final UserRepository userRepository;

    public ProfileServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public ProfileDTO getProfile(User user) {
        Profile profile = user.getProfile();
        if (profile == null) {
            throw new ResourceNotFoundException("User profile not found");
        }

        ProfileDTO dto = new ProfileDTO();
        dto.setFullName(profile.getFullName());
        dto.setDob(profile.getDob());
        dto.setGender(profile.getGender());
        dto.setAddress(profile.getAddress());
        dto.setPhone(profile.getPhone());
        return dto;
    }
        // Hàm updateUserProfile vẫn có thể giữ nguyên
    public User getUserProfile(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public User updateUserProfile(Long userId, ProfileDTO profileDTO) {
        User user = getUserProfile(userId);

        if (user.getProfile() == null) {
            user.setProfile(new Profile());
        }

        Profile profile = user.getProfile();
        profile.setFullName(profileDTO.getFullName());
        profile.setDob(profileDTO.getDob());
        profile.setGender(profileDTO.getGender());
        profile.setAddress(profileDTO.getAddress());
        profile.setPhone(profileDTO.getPhone());

        return userRepository.save(user);
    }
}
