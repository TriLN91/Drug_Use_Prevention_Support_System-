
package com.example.druguseprevention.controller;

import com.example.druguseprevention.entity.Profile;
import com.example.druguseprevention.entity.User;
import com.example.druguseprevention.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email đã tồn tại");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return ResponseEntity.ok(userRepository.save(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        return userRepository.findById(id).map(existingUser -> {
            if (!existingUser.getEmail().equals(updatedUser.getEmail())) {
                if (userRepository.existsByEmail(updatedUser.getEmail())) {
                    return ResponseEntity.badRequest().body("Email đã tồn tại");
                }
                existingUser.setEmail(updatedUser.getEmail());
            }

            existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
            existingUser.setRole(updatedUser.getRole());

            if (existingUser.getProfile() == null) {
                existingUser.setProfile(new Profile());
            }

            Profile newProfile = updatedUser.getProfile();
            if (newProfile != null) {
                Profile p = existingUser.getProfile();
                p.setFullName(newProfile.getFullName());
                p.setDob(newProfile.getDob());
                p.setGender(newProfile.getGender());
                p.setAddress(newProfile.getAddress());
                p.setPhone(newProfile.getPhone());
                p.setAvatarUrl(newProfile.getAvatarUrl());
            }

            return ResponseEntity.ok(userRepository.save(existingUser));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            try {
                userRepository.delete(user);
                return ResponseEntity.ok("Xóa thành công");
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(500).body("Lỗi khi xóa user: " + e.getMessage());
            }
        }).orElse(ResponseEntity.notFound().build());
    }

}