package com.example.druguseprevention.entity;

import com.example.druguseprevention.enums.Gender;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.example.druguseprevention.enums.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Role role;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "fullName", column = @Column(name = "full_name")),
            @AttributeOverride(name = "dob", column = @Column(name = "dob")),
            @AttributeOverride(name = "gender", column = @Column(name = "gender")),
            @AttributeOverride(name = "address", column = @Column(name = "address")),
            @AttributeOverride(name = "phone", column = @Column(name = "phone")),
            @AttributeOverride(name = "avatarUrl", column = @Column(name = "avatar_url"))
    })
    private Profile profile;

    // === Spring Security ===
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null; // nếu có phân quyền chi tiết, return danh sách roles ở đây
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public void setRole(com.example.druguseprevention.enums.Role role) {
    }
}
