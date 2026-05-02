package com.minhhuu.quizz.controller;

import com.minhhuu.quizz.dto.*;
import com.minhhuu.quizz.service.quizz.IQuizService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizz")
public class QuizController {
    private final IQuizService quizService;

    public QuizController(IQuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping("")
    public ResponseEntity<List<QuizResponse>> getAllQuiz() {
        return ResponseEntity.ok(quizService.getAllQuizzes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuizResponse> getQuizById(@PathVariable Long id) {
        return ResponseEntity.ok(quizService.getQuizById(id));
    }

    @PostMapping("")
    public ResponseEntity<QuizResponse> createQuiz(@RequestBody QuizRequest quizRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(quizService.createQuiz(quizRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuizResponse> updateQuiz(@PathVariable Long id, @RequestBody QuizRequest quizRequest) {
        return ResponseEntity.ok(quizService.updateQuiz(id, quizRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long id) {
        quizService.deleteQuiz(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/playQuiz")
    public ResponseEntity<QuizVariantResponse> playQuiz(@RequestParam Long quizId) {
        return ResponseEntity.ok(quizService.playQuiz(quizId));
    }

    @PostMapping("/submitQuiz")
    public ResponseEntity<QuizResult> submitQuiz(@RequestBody QuizSubmission quizSubmitRequest) {
        return ResponseEntity.ok(quizService.submitQuiz(quizSubmitRequest));
    }
}
