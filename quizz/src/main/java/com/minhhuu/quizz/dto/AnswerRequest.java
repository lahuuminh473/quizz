package com.minhhuu.quizz.dto;

import lombok.Data;

@Data
public class AnswerRequest {
    private Boolean isCorrect;
    private String text;
    private String imageUrl;
}
