package com.minhhuu.quizz.dto;

import lombok.Data;

import java.util.List;

@Data
public class QuizVariantResponse {
    private Long id;
    private String code;
    private List<QuestionResponse> questions;
}
