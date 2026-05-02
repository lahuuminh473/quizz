package com.minhhuu.quizz.dto;

import lombok.Data;

@Data
public class QuizResult {
    private double score;
    private int correctCount;
    private int total;
}
