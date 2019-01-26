package com.example.demo.repos;

import com.example.demo.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserDetailsRepo extends JpaRepository<User, Long> {
    List<User> findByName(String name);
}
