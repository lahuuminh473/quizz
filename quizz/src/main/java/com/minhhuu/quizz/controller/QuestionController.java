package com.minhhuu.quizz.controller;

import com.minhhuu.quizz.dto.QuestionRequest;
import com.minhhuu.quizz.dto.QuestionResponse;
import com.minhhuu.quizz.service.question.IQuestionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/question")
public class QuestionController {
    private final IQuestionService questionService;

    public QuestionController(IQuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping("")
    public ResponseEntity<List<QuestionResponse>> getAllQuestions() {
        return ResponseEntity.ok(questionService.getAllQuestions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionResponse> getQuestionById(@PathVariable Long id) {
        return ResponseEntity.ok(questionService.getQuestionById(id));
    }

    @PostMapping("")
    public ResponseEntity<QuestionResponse> createQuestion(@RequestBody QuestionRequest questionRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(questionService.createQuestion(questionRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuestionResponse> updateQuestion(@PathVariable Long id, @RequestBody QuestionRequest questionRequest) {
        return ResponseEntity.ok(questionService.updateQuestion(id, questionRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }
}
