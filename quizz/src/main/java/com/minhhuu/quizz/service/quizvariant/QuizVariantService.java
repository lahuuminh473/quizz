package com.minhhuu.quizz.service.quizvariant;

import com.minhhuu.quizz.dto.QuestionResponse;
import com.minhhuu.quizz.dto.QuizVariantRequest;
import com.minhhuu.quizz.dto.QuizVariantResponse;
import com.minhhuu.quizz.entity.*;
import com.minhhuu.quizz.exception.NotEnoughQuestionException;
import com.minhhuu.quizz.repository.QuestionRepository;
import com.minhhuu.quizz.repository.QuizRepository;
import com.minhhuu.quizz.repository.QuizVariantRepository;
import com.minhhuu.quizz.service.quizvariant.IQuizVariantService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class QuizVariantService implements IQuizVariantService {
    private final QuizVariantRepository quizVariantRepository;
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    public QuizVariantService(QuizVariantRepository quizVariantRepository, QuizRepository quizRepository, QuestionRepository questionRepository) {
        this.quizVariantRepository = quizVariantRepository;
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
    }

    @Override
    public List<QuizVariantResponse> getAllByQuizId(Long quizId) {
        return quizVariantRepository.findByQuizId(quizId).stream().map(this::mapToDTO).toList();
    }

    @Override
    public List<QuizVariantResponse> createQuizVariant(QuizVariantRequest quizVariantRequest) {
        Quiz quiz = quizRepository.findById(quizVariantRequest.getQuizId())
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + quizVariantRequest.getQuizId()));
        int code=1;
        List<QuizVariant>variants=new ArrayList<>();
        for(int i = 0; i < quizVariantRequest.getNumberOfVariants(); i++) {
            List<Question>selectedQuestions=new ArrayList<>();
            QuizVariant quizVariant = new QuizVariant();
            quizVariant.setQuiz(quiz);
            quizVariant.setCode(String.valueOf(code++));
            List<QuizRule> quizRules = quiz.getQuizRules();
            for(QuizRule quizRule : quizRules) {
                List<Question> questions = questionRepository.findRandomByCategoryAndDifficulty(
                        quizRule.getCategory().getId(),
                        quizRule.getDifficulty().toString(),
                        quizRule.getNumQuestions()
                );
                if(questions.size()<quizRule.getNumQuestions()){
                    throw new NotEnoughQuestionException("not enough question quantity");
                }
                selectedQuestions.addAll(questions);
            }
            quizVariant.setQuestions(selectedQuestions);
            quizVariant.setTotalQuest(quiz. getTotalQuest());
            variants.add(quizVariant);
        }
        List<QuizVariant>saved=quizVariantRepository.saveAll(variants);
        return saved.stream().map(this::mapToDTO).toList();
    }


    public QuizVariantResponse mapToDTO(QuizVariant quizVariant) {

            QuizVariantResponse quizVariantResponse = new QuizVariantResponse();
            quizVariantResponse.setId(quizVariant.getId());
            quizVariantResponse.setCode(quizVariant.getCode());
            List<QuestionResponse> questionResponses = quizVariant.getQuestions().stream().map(question -> {
                QuestionResponse questionResponse = new QuestionResponse();
                questionResponse.setId(question.getId());
                questionResponse.setContent(question.getContent());
                questionResponse.setDifficulty(question.getDifficulty());
                return questionResponse;
            }).toList();
            return quizVariantResponse;

    }
}