package com.example.druguseprevention.dto;

import com.example.druguseprevention.enums.Gender;
import com.example.druguseprevention.enums.Role;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserResponse {
    String username;
    String email;
    String fullName;
    String phoneNumber;
    String address;
    LocalDate dateOfBirth;
    Gender gender;
    Role role;
    String token;

}
