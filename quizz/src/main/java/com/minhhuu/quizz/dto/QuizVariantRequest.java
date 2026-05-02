package com.minhhuu.quizz.dto;

import lombok.Data;

@Data
public class QuizVariantRequest {
    private Long quizId;
    private Integer numberOfVariants;
}
