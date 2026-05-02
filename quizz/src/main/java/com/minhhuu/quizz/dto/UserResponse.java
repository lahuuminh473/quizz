package com.minhhuu.quizz.dto;

import com.minhhuu.quizz.entity.Role;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String address;

    private Role role;
}
