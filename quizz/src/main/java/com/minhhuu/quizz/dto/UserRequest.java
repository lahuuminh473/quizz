package com.minhhuu.quizz.dto;

import com.minhhuu.quizz.entity.Role;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

@Data
public class UserRequest {
    private String email;
    private String address;
    private String username;
    private String password;
    private Role role;
}
