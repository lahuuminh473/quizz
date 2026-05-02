package com.minhhuu.quizz.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;

@Data
@AllArgsConstructor
public class ApiResponse {
    private Object data;
    private String message;
}
