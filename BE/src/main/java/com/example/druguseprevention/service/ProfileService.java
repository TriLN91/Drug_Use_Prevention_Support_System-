package com.example.druguseprevention.service;

import com.example.druguseprevention.dto.ProfileDTO;
import com.example.druguseprevention.entity.User;

public interface ProfileService {
    ProfileDTO getProfile(User user);
}
