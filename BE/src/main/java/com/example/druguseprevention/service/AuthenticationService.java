package com.example.druguseprevention.service;

import com.example.druguseprevention.dto.EmailDetail;
import com.example.druguseprevention.dto.LoginRequest;
import com.example.druguseprevention.dto.RegisterRequest;
import com.example.druguseprevention.dto.UserResponse;
import com.example.druguseprevention.entity.User;
import com.example.druguseprevention.enums.Role;
import com.example.druguseprevention.exception.AuthenticationException;
import com.example.druguseprevention.repository.AuthenticationRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService implements UserDetailsService {

    @Autowired
    AuthenticationRepository authenticationRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    TokenService tokenService;

    @Autowired
    EmailService emailService;

    public User register (RegisterRequest registerRequest){
        User user = new User();
        user.setUserName(registerRequest.getUserName());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setEmail(registerRequest.getEmail());
        user.setFullName(registerRequest.getFullName());
        user.setPhoneNumber(registerRequest.getPhoneNumber());
        user.setAddress(registerRequest.getAddress());
        user.setDateOfBirth(registerRequest.getDateOfBirth());
        user.setGender(registerRequest.getGender());
        // Gán role mặc định là "Member"
        user.setRole(Role.MEMBER);
        // Send email
        EmailDetail emailDetail = new EmailDetail();
        emailDetail.setRecipient(user.getEmail());
        emailDetail.setSubject("Welcome to my system");
        emailService.sendEmail(emailDetail,user);
        return authenticationRepository.save(user);
    }

    public UserResponse login (LoginRequest loginRequest){
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    loginRequest.getUserName(),
                    loginRequest.getPassword()
            ));

        }catch (Exception e){
            throw new AuthenticationException("Username or Password not valid!");
        }
        User user = authenticationRepository.findUserByUserName(loginRequest.getUserName());
        UserResponse userResponse = modelMapper.map(user, UserResponse.class);
        String token = tokenService.generateToken(user);
        userResponse.setToken(token);
        return userResponse ;
    }

    @Override
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
        return authenticationRepository.findUserByUserName(userName);
    }
}
