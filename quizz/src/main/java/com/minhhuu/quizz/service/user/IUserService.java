package com.minhhuu.quizz.service.user;


import com.minhhuu.quizz.dto.UserRequest;
import com.minhhuu.quizz.dto.UserResponse;

import java.util.List;

public interface IUserService {
    List<UserResponse>getAllUsers();
    UserResponse getUserById(Long id);
    UserResponse createUser(UserRequest request);
    UserResponse updateUser(Long id, UserRequest request);
    void deleteUser(Long id);
}
