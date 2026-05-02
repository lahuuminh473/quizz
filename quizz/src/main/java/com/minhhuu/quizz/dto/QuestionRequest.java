package com.minhhuu.quizz.dto;


import com.minhhuu.quizz.entity.Difficulty;

import lombok.Data;

import java.util.List;

@Data
public class QuestionRequest {
    private String content;
    private Difficulty difficulty; // EASY, MEDIUM, HARD
    private Long categoryId;
    private List<AnswerRequest> answers;
    private int correctAnswer;
}
