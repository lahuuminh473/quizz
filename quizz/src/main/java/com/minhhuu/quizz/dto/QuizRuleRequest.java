package com.minhhuu.quizz.dto;


import com.minhhuu.quizz.entity.Difficulty;

import lombok.Data;

@Data
public class QuizRuleRequest {
    private Long categoryId;
    private Difficulty difficulty;
    private int numQuestions;
}
