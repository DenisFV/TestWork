package com.example.demo.controller;

import com.example.demo.domain.User;
import com.example.demo.repos.UserDetailsRepo;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("user")
public class UserController {

    private final UserDetailsRepo userDetailsRepo;
    @Autowired
    public UserController(UserDetailsRepo userDetailsRepo) {
        this.userDetailsRepo=userDetailsRepo;
    }

    @GetMapping
    public List<User> list() {
        return userDetailsRepo.findAll();
    }

    @GetMapping("{id}")
    public User getOne(@PathVariable("id") User user) {
        return user;
    }

    @PostMapping
    public User create(@RequestBody User user) {
        return userDetailsRepo.save(user);
    }

    @PutMapping("{id}")
    public User update(@PathVariable("id") User userFromDb, @RequestBody User user) {
        BeanUtils.copyProperties(user, userFromDb, "id");
        return userDetailsRepo.save(userFromDb);
    }

    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") User user) {
        userDetailsRepo.delete(user);
    }
}
