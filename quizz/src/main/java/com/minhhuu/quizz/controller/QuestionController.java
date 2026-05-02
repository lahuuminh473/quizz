package com.minhhuu.quizz.controller;

import com.minhhuu.quizz.dto.QuestionRequest;
import com.minhhuu.quizz.dto.QuestionResponse;
import com.minhhuu.quizz.dto.UserRequest;
import com.minhhuu.quizz.dto.UserResponse;
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
    public ResponseEntity<List<QuestionResponse>> getAllQuestions(){
        List<QuestionResponse> questions = questionService.getAllQuestions();
        return ResponseEntity.ok(questions);
    }
    @GetMapping("/{id}")
    public ResponseEntity<QuestionResponse> getQuestionById(@PathVariable Long id){
        QuestionResponse question = questionService.getQuestionById(id);
        return ResponseEntity.ok(question);
    }
    @PostMapping("")
    public ResponseEntity<QuestionResponse> createQuestion(QuestionRequest questionRequest){
        QuestionResponse createdQuestion = questionService.createQuestion(questionRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdQuestion);
    }
    @PutMapping("/{id}")
    public ResponseEntity<QuestionResponse> updateQuestion(@PathVariable Long id, QuestionRequest userRequest){
        QuestionResponse updatedQuestion = questionService.updateQuestion(id, userRequest);
        return ResponseEntity.ok(updatedQuestion);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id){
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }
}
