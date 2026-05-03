package com.minhhuu.quizz.dto;

import com.minhhuu.quizz.entity.Difficulty;
import lombok.Data;

import java.util.List;

@Data
public class QuestionResponse {
    private Long id;
    private String content;
    private String imageUrl;
    private Difficulty difficulty;
    private CategoryResponse category;
    private List<AnswerResponse> answers;
}
