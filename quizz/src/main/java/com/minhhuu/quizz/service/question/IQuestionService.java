package com.minhhuu.quizz.service.question;

import com.minhhuu.quizz.dto.QuestionRequest;
import com.minhhuu.quizz.dto.QuestionResponse;


import java.util.List;

public interface IQuestionService {
    List<QuestionResponse>getAllQuestions();
    QuestionResponse getQuestionById(Long id);
    QuestionResponse createQuestion(QuestionRequest request);
    QuestionResponse updateQuestion(Long id, QuestionRequest request);
    void deleteQuestion(Long id);
}
