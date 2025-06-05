package com.example.druguseprevention.dto;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ProfileDTO {
    private String fullName;
    private LocalDate dob;
    private String gender;
    private String address;
    private String phone;

}

