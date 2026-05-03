package com.minhhuu.quizz.controller;

import com.minhhuu.quizz.dto.QuizVariantRequest;
import com.minhhuu.quizz.dto.QuizVariantResponse;
import com.minhhuu.quizz.service.quizvariant.IQuizVariantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz-variants")
public class QuizVariantController {
    private final IQuizVariantService quizVariantService;

    public QuizVariantController(IQuizVariantService quizVariantService) {
        this.quizVariantService = quizVariantService;
    }

    @PostMapping("")
    public ResponseEntity<List<QuizVariantResponse>> createQuizVariant(@RequestBody QuizVariantRequest quizVariantRequest) {
        return ResponseEntity.status(201).body(quizVariantService.createQuizVariant(quizVariantRequest));
    }

    @GetMapping("")
    public ResponseEntity<List<QuizVariantResponse>> getAllByQuizId(@RequestParam Long quizId) {
        return ResponseEntity.ok(quizVariantService.getAllByQuizId(quizId));
    }
}
