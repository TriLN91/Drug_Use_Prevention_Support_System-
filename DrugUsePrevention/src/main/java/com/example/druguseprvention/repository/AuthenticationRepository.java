package com.example.druguseprvention.repository;

import com.example.druguseprvention.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthenticationRepository extends JpaRepository<User, Long> {
    User findUserByUsername (String username);
}
