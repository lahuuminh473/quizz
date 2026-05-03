package com.minhhuu.quizz.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.minhhuu.quizz.entity.Role;
import lombok.Data;

@Data
public class UserRequest {
    @JsonProperty("username")
    private String username;
    private String email;
    private String address;
    private String password;
    private Role role;
}
