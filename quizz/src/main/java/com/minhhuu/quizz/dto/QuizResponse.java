package com.minhhuu.quizz.dto;


import com.minhhuu.quizz.entity.QuizRule;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class QuizResponse {
    private Long id;
    private String title;
    private Integer totalQuest;
    private Integer duration;
    private UserResponse user;
    private LocalDateTime createdAt;
    private List<QuizRuleResponse>quizRuleResponses;
}
