package com.minhhuu.quizz.service.question;

import com.minhhuu.quizz.dto.*;
import com.minhhuu.quizz.entity.Answer;
import com.minhhuu.quizz.entity.Category;
import com.minhhuu.quizz.entity.Question;
import com.minhhuu.quizz.exception.ResourceNotFoundException;
import com.minhhuu.quizz.repository.CategoryRepository;
import com.minhhuu.quizz.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionService implements IQuestionService {

    private final CategoryRepository categoryRepository;
    private final QuestionRepository questionRepository;

    @Override
    public List<QuestionResponse> getAllQuestions() {
        return questionRepository.findAll().stream().map(this::mapToDTO).toList();
    }

    @Override
    public QuestionResponse getQuestionById(Long id) {
        return questionRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + id));
    }

    @Override
    public QuestionResponse createQuestion(QuestionRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        if (request.getAnswers() == null || request.getAnswers().size() < 2)
            throw new RuntimeException("A question must have at least two answers.");

        long correctCount = request.getAnswers().stream().filter(a -> Boolean.TRUE.equals(a.getIsCorrect())).count();
        if (correctCount != 1)
            throw new RuntimeException("Question must have exactly one correct answer");

        Question question = new Question();
        question.setContent(request.getContent());
        question.setImageUrl(request.getImageUrl());
        question.setDifficulty(request.getDifficulty());
        question.setCategory(category);

        List<Answer> answerList = request.getAnswers().stream().map(ar -> {
            Answer a = new Answer();
            a.setText(ar.getText());
            a.setImageUrl(ar.getImageUrl());
            a.setQuestion(question);
            a.setIsCorrect(ar.getIsCorrect());
            return a;
        }).toList();
        question.setAnswers(answerList);

        return mapToDTO(questionRepository.save(question));
    }

    @Override
    public QuestionResponse updateQuestion(Long id, QuestionRequest request) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + id));
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        question.setContent(request.getContent());
        question.setImageUrl(request.getImageUrl());
        question.setDifficulty(request.getDifficulty());
        question.setCategory(category);

        // Update answers
        question.getAnswers().clear();
        List<Answer> newAnswers = request.getAnswers().stream().map(ar -> {
            Answer a = new Answer();
            a.setText(ar.getText());
            a.setImageUrl(ar.getImageUrl());
            a.setQuestion(question);
            a.setIsCorrect(ar.getIsCorrect());
            return a;
        }).toList();
        question.getAnswers().addAll(newAnswers);

        return mapToDTO(questionRepository.save(question));
    }

    @Override
    public void deleteQuestion(Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + id));
        questionRepository.delete(question);
    }

    public QuestionResponse mapToDTO(Question question) {
        CategoryResponse categoryResponse = new CategoryResponse();
        categoryResponse.setId(question.getCategory().getId());
        categoryResponse.setName(question.getCategory().getName());
        categoryResponse.setDescription(question.getCategory().getDescription());

        List<AnswerResponse> answerResponses = question.getAnswers().stream().map(answer -> {
            AnswerResponse ar = new AnswerResponse();
            ar.setId(answer.getId());
            ar.setText(answer.getText());
            ar.setImageUrl(answer.getImageUrl());
            return ar;
        }).toList();

        QuestionResponse response = new QuestionResponse();
        response.setId(question.getId());
        response.setContent(question.getContent());
        response.setImageUrl(question.getImageUrl());
        response.setDifficulty(question.getDifficulty());
        response.setCategory(categoryResponse);
        response.setAnswers(answerResponses);
        return response;
    }
}
