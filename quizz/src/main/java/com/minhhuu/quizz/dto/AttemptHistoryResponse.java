package com.minhhuu.quizz.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class AttemptHistoryResponse {
    private Long id;
    private String quizTitle;
    private String variantCode;
    private int score;
    private int totalQuest;
    private int correctCount;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private List<UserAnswerDetail> answerDetails;

    @Data
    public static class UserAnswerDetail {
        private String questionContent;
        private String questionImageUrl;
        private String selectedAnswerText;
        private String selectedAnswerImageUrl;
        private String correctAnswerText;
        private String correctAnswerImageUrl;
        private boolean correct;
    }
}
