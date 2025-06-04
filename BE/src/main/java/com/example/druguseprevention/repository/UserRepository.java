package com.example.druguseprevention.repository;
import com.example.druguseprevention.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository // Đánh dấu đây là Spring Data Repository

public interface UserRepository extends JpaRepository<User, Long> {
    // Tìm user bằng email (đã được sử dụng trong AuthService)
    Optional<User> findByEmail(String email);

    // Thêm phương thức mới nếu cần
    boolean existsByEmail(String email); // Kiểm tra email đã tồn tại chưa
}