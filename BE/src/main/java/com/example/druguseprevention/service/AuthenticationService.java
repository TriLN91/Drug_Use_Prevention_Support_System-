package com.example.druguseprevention.service;

import com.example.druguseprevention.dto.LoginRequest;
import com.example.druguseprevention.dto.RegisterRequest;
import com.example.druguseprevention.entity.Profile;
import com.example.druguseprevention.entity.User;
import com.example.druguseprevention.enums.Role;
import com.example.druguseprevention.exception.AuthenticationException;
import com.example.druguseprevention.repository.AuthenticationRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthenticationService implements UserDetailsService {

    private final AuthenticationRepository authenticationRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(
            AuthenticationRepository authenticationRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager) {
        this.authenticationRepository = authenticationRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    public User register(RegisterRequest registerRequest) {
        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(Role.MEMBER);

        Profile profile = new Profile();
        profile.setFullName(registerRequest.getFullName());
        profile.setPhone(registerRequest.getPhoneNumber());
        profile.setAddress(registerRequest.getAddress());
        profile.setDob(registerRequest.getDateOfBirth());
        profile.setGender(registerRequest.getGender().name());
        profile.setAvatarUrl(null); // hoặc đặt ảnh mặc định nếu muốn

        user.setProfile(profile);
        return authenticationRepository.save(user);
    }

    public User login(LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );
        } catch (Exception e) {
            throw new AuthenticationException("Email or Password not valid!");
        }

        return authenticationRepository
                .findUserByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return authenticationRepository
                .findUserByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
