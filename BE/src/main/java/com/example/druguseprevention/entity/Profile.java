package com.example.druguseprevention.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.time.LocalDate;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Profile {
    private String fullName;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dob;

    private String gender;
    private String address;
    private String phone;
    private String avatarUrl;
}
