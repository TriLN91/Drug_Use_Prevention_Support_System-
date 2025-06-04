package com.example.druguseprvention.api;

import com.example.druguseprvention.dto.LoginRequest;
import com.example.druguseprvention.dto.RegisterRequest;
import com.example.druguseprvention.entity.User;
import com.example.druguseprvention.service.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
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
        User user = authenticationService.login(loginRequest);
        return ResponseEntity.ok(user);
    }
}
