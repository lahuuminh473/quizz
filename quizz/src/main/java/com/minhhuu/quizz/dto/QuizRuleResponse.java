package com.minhhuu.quizz.dto;

import com.minhhuu.quizz.entity.Category;
import com.minhhuu.quizz.entity.Difficulty;
import lombok.Data;


@Data
public class QuizRuleResponse {
    private Long id;
    private CategoryResponse category;
    private Difficulty difficulty;
    private int numQuestions;
}
