package com.minhhuu.quizz.controller;

import com.minhhuu.quizz.dto.*;
import com.minhhuu.quizz.entity.QuizVariant;
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
    public ResponseEntity<List<QuizResponse>> getAllQuiz(){
        List<QuizResponse> quiz = quizService.getAllQuizzes();
        return ResponseEntity.ok(quiz);
    }
    @GetMapping("/{id}")
    public ResponseEntity<QuizResponse> getQuizById(@PathVariable Long id){
        QuizResponse quiz = quizService.getQuizById(id);
        return ResponseEntity.ok(quiz);
    }
    @PostMapping("")
    public ResponseEntity<QuizResponse> createQuiz(QuizRequest quizRequest){
        QuizResponse createdQuiz = quizService.createQuiz(quizRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdQuiz);
    }
    @PutMapping("/{id}")
    public ResponseEntity<QuizResponse> updateQuiz(@PathVariable Long id, QuizRequest quizRequest){
        QuizResponse updatedQuiz = quizService.updateQuiz(id, quizRequest);
        return ResponseEntity.ok(updatedQuiz);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long id){
        quizService.deleteQuiz(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/playQuiz")
    public ResponseEntity<QuizVariantResponse>playQuiz(@PathVariable Long quizId){
        QuizVariantResponse response = quizService.playQuiz(quizId);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/submitQuiz")
    public ResponseEntity<QuizResult> submitQuiz(@RequestBody QuizSubmission quizSubmitRequest){
        QuizResult result = quizService.submitQuiz(quizSubmitRequest);
        return ResponseEntity.ok(result);
    }
}
