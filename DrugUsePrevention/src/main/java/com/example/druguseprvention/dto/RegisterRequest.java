package com.example.druguseprvention.dto;

import com.example.druguseprvention.enums.Gender;
import lombok.Data;

import java.time.LocalDate;

@Data
public class RegisterRequest {
    String userName;
    String password;
    String email;
    String fullName;
    String phoneNumber;
    String address;
    LocalDate dateOfBirth;
    Gender gender;

}
