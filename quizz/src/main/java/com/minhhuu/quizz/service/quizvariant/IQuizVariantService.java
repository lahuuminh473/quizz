package com.minhhuu.quizz.service.quizvariant;

import com.minhhuu.quizz.dto.QuizResponse;
import com.minhhuu.quizz.dto.QuizVariantRequest;
import com.minhhuu.quizz.dto.QuizVariantResponse;

import java.util.List;

public interface IQuizVariantService {
    List<QuizVariantResponse> getAllByQuizId(Long quizId);
    List<QuizVariantResponse> createQuizVariant(QuizVariantRequest quizVariantRequest);

}
