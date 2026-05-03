package com.minhhuu.quizz.controller;

import com.minhhuu.quizz.dto.AttemptHistoryResponse;
import com.minhhuu.quizz.repository.QuizVariantAttemptRepository;
import com.minhhuu.quizz.entity.QuizVariantAttempt;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
public class HistoryController {

    private final QuizVariantAttemptRepository quizVariantAttemptRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AttemptHistoryResponse>> getUserHistory(@PathVariable Long userId) {
        List<QuizVariantAttempt> attempts = quizVariantAttemptRepository.findByUserIdOrderByStartTimeDesc(userId);
        List<AttemptHistoryResponse> responses = attempts.stream().map(a -> {
            AttemptHistoryResponse r = new AttemptHistoryResponse();
            r.setId(a.getId());
            r.setQuizTitle(a.getVariant().getQuiz().getTitle());
            r.setVariantCode(a.getVariant().getCode());
            r.setScore(a.getScore());
            r.setTotalQuest(a.getVariant().getTotalQuest());
            r.setStartTime(a.getStartTime());
            r.setEndTime(a.getEndTime());
            r.setCorrectCount((int) a.getUserAnswers().stream().filter(ua -> ua.isCorrect()).count());
            return r;
        }).toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/attempt/{attemptId}")
    public ResponseEntity<AttemptHistoryResponse> getAttemptDetail(@PathVariable Long attemptId) {
        QuizVariantAttempt a = quizVariantAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Attempt not found"));

        AttemptHistoryResponse r = new AttemptHistoryResponse();
        r.setId(a.getId());
        r.setQuizTitle(a.getVariant().getQuiz().getTitle());
        r.setVariantCode(a.getVariant().getCode());
        r.setScore(a.getScore());
        r.setTotalQuest(a.getVariant().getTotalQuest());
        r.setStartTime(a.getStartTime());
        r.setEndTime(a.getEndTime());
        r.setCorrectCount((int) a.getUserAnswers().stream().filter(ua -> ua.isCorrect()).count());

        List<AttemptHistoryResponse.UserAnswerDetail> details = a.getUserAnswers().stream().map(ua -> {
            AttemptHistoryResponse.UserAnswerDetail d = new AttemptHistoryResponse.UserAnswerDetail();
            d.setQuestionContent(ua.getQuestion().getContent());
            d.setQuestionImageUrl(ua.getQuestion().getImageUrl());
            d.setSelectedAnswerText(ua.getSelectedAnswer().getText());
            d.setSelectedAnswerImageUrl(ua.getSelectedAnswer().getImageUrl());
            d.setCorrect(ua.isCorrect());
            // Find correct answer text
            ua.getQuestion().getAnswers().stream()
                    .filter(ans -> Boolean.TRUE.equals(ans.getIsCorrect()))
                    .findFirst()
                    .ifPresent(ans -> {
                        d.setCorrectAnswerText(ans.getText());
                        d.setCorrectAnswerImageUrl(ans.getImageUrl());
                    });
            return d;
        }).toList();
        r.setAnswerDetails(details);

        return ResponseEntity.ok(r);
    }
}
