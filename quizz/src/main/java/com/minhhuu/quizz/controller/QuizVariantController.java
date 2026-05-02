package com.minhhuu.quizz.controller;

import com.minhhuu.quizz.dto.QuizVariantRequest;
import com.minhhuu.quizz.dto.QuizVariantResponse;
import com.minhhuu.quizz.service.quizvariant.IQuizVariantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@RestController
@RequestMapping("/api/quiz-variants")
public class QuizVariantController {
    private final IQuizVariantService quizVariantService;
    public QuizVariantController(IQuizVariantService quizVariantService) {
        this.quizVariantService = quizVariantService;
    }
    @PostMapping("")
    public ResponseEntity<List<QuizVariantResponse>>createQuizVariant(QuizVariantRequest quizVariantRequest){
        List<QuizVariantResponse> createdQuizVariant = quizVariantService.createQuizVariant(quizVariantRequest);
        return ResponseEntity.status(201).body(createdQuizVariant);
    }
    @GetMapping("/{id}")
    public ResponseEntity<List<QuizVariantResponse>> getAllByQuizId(Long quizId){
        List<QuizVariantResponse> quizVariants = quizVariantService.getAllByQuizId(quizId);
        return ResponseEntity.ok(quizVariants);
    }
}
