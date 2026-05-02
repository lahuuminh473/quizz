package com.minhhuu.quizz.service.quizz;

import com.minhhuu.quizz.dto.*;

import java.util.List;


public interface IQuizService {
    QuizResponse getQuizById(Long quizId);
    List<QuizResponse> getAllQuizzes();
    QuizResponse createQuiz(QuizRequest quizRequest);
    QuizResponse updateQuiz(Long id,QuizRequest quizRequest);
    void deleteQuiz(Long id);
    QuizVariantResponse playQuiz(Long quizId);
    QuizResult submitQuiz(QuizSubmission quizSubmission);
}
