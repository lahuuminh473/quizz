package com.minhhuu.quizz.dto;

import com.minhhuu.quizz.entity.User;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class QuizRequest {
    private String title;
    private LocalDateTime createdAt;
    private Integer duration;
    private Long userId;
    private List<QuizRuleRequest>quizRuleRequests;
}
