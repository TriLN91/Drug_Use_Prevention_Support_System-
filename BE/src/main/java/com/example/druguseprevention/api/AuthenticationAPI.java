package com.example.druguseprevention.api;

import com.example.druguseprevention.dto.LoginRequest;
import com.example.druguseprevention.dto.RegisterRequest;
import com.example.druguseprevention.dto.UserResponse;
import com.example.druguseprevention.entity.User;
import com.example.druguseprevention.service.AuthenticationService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
//@CrossOrigin(origins = "*")
public class AuthenticationAPI {

    @Autowired
    AuthenticationService authenticationService;

    @PostMapping("/api/register")
    public ResponseEntity register(@Valid @RequestBody RegisterRequest registerRequest){
        User newUser = authenticationService.register(registerRequest);
        return ResponseEntity.ok(newUser);
    }

    @PostMapping("/api/login")
    public ResponseEntity login (@RequestBody LoginRequest loginRequest){
        UserResponse userResponse = authenticationService.login(loginRequest);
        return ResponseEntity.ok(userResponse);
    }


}
