package com.minhhuu.quizz.controller;

import com.minhhuu.quizz.dto.UserRequest;
import com.minhhuu.quizz.dto.UserResponse;
import com.minhhuu.quizz.entity.User;
import com.minhhuu.quizz.service.user.IUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final IUserService userService;

    public UserController(IUserService userService) {
        this.userService = userService;
    }
    @GetMapping("")
    public ResponseEntity<List<UserResponse>>getAllUsers(){
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable  Long id){
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }
    @PostMapping("")
    public ResponseEntity<UserResponse> createUser( UserRequest userRequest){
        UserResponse createdUser = userService.createUser(userRequest);
        return ResponseEntity.ok(createdUser);
    }
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, UserRequest userRequest){
        UserResponse updatedUser = userService.updateUser(id, userRequest);
        return ResponseEntity.ok(updatedUser);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id){
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
