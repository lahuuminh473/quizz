package com.minhhuu.quizz.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class QuizSubmission {
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Long userId;
    private Long quizVariantId;
    private List<AnswerInput> anserInputList;
}
