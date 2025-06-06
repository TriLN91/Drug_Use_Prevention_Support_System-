package com.example.druguseprevention.api;

import com.example.druguseprevention.dto.ProfileDTO;
import com.example.druguseprevention.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserService userService;

    public ProfileController(UserService userService) {
        this.userService = userService;
    }

    // GET: Lấy thông tin hồ sơ
    @GetMapping
    public ResponseEntity<ProfileDTO> getProfile() {
        return ResponseEntity.ok(userService.getProfile());
    }

    // PUT: Cập nhật thông tin hồ sơ
    @PutMapping
    public ResponseEntity<String> updateProfile(@RequestBody ProfileDTO profileDTO) {
        userService.updateProfile(profileDTO);
        return ResponseEntity.ok("Cập nhật hồ sơ thành công");
    }
}