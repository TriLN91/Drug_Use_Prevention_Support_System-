package com.example.druguseprevention.api;

import com.example.druguseprevention.dto.ProfileDTO;
import com.example.druguseprevention.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin("*")
public class ProfileController {

    private final UserService userService;

    public ProfileController(UserService userService) {
        this.userService = userService;
    }

    // GET: Lấy thông tin hồ sơ
    @GetMapping
    public ResponseEntity<List<ProfileDTO>> getProfiles() {
        return ResponseEntity.ok(userService.getProfiles());
    }

    // PUT: Cập nhật thông tin hồ sơ
    @PutMapping
    public ResponseEntity<String> updateProfile(@RequestBody ProfileDTO profileDTO) {
        userService.updateProfile(profileDTO);
        return ResponseEntity.ok("Cập nhật hồ sơ thành công");
    }
}