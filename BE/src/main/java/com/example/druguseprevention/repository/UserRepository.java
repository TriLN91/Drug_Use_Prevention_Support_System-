package com.example.druguseprevention.repository;

import com.example.druguseprevention.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Thêm dòng này nếu chưa có
    Optional<User> findByUsername(String username);

    // Giữ lại findByEmail nếu bạn vẫn dùng ở đâu đó
    Optional<User> findByEmail(String email);
}