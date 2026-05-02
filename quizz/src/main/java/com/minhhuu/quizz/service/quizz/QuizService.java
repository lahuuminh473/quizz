package com.minhhuu.quizz.service.quizz;

import com.minhhuu.quizz.dto.*;
import com.minhhuu.quizz.entity.*;
import com.minhhuu.quizz.exception.ResourceNotFoundException;
import com.minhhuu.quizz.repository.*;
import com.minhhuu.quizz.service.quizvariant.QuizVariantService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class QuizService implements IQuizService {
    private final QuizRepository quizRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final QuizVariantRepository quizVariantRepository;
    private final QuizVariantService quizVariantService;
    private final QuizVariantAttemptRepository quizVariantAttemptRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    public QuizService(QuizRepository quizRepository, UserRepository userRepository, CategoryRepository categoryRepository, QuizVariantRepository quizVariantRepository, QuizVariantService quizVariantService, QuizVariantAttemptRepository quizVariantAttemptRepository, QuestionRepository questionRepository, AnswerRepository answerRepository) {
        this.quizRepository = quizRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.quizVariantRepository = quizVariantRepository;
        this.quizVariantService = quizVariantService;
        this.quizVariantAttemptRepository = quizVariantAttemptRepository;
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
    }

    @Override
    public QuizResponse getQuizById(Long quizId) {
        return quizRepository.findById(quizId)
                .map(this::mapToQuizResponse)
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + quizId));
    }

    @Override
    public List<QuizResponse> getAllQuizzes() {
        return quizRepository.findAll().stream()
                .map(this::mapToQuizResponse)
                .toList();
    }

    @Override
    public QuizResponse createQuiz(QuizRequest quizRequest) {
        User user=userRepository.findById(quizRequest.getUserId())
                .orElseThrow(()->new ResourceNotFoundException("User not found with id: "+quizRequest.getUserId()));
        Quiz quiz = new Quiz();
        List<QuizRule>quizRules=quizRequest.getQuizRuleRequests().stream().map(quizRuleRequest -> {
            Category category=categoryRepository.findById(quizRuleRequest.getCategoryId())
                    .orElseThrow(()->new ResourceNotFoundException("Category not found with id: "+quizRuleRequest.getCategoryId()));
            QuizRule quizRule = new QuizRule();
            quizRule.setDifficulty(quizRuleRequest.getDifficulty());
            quizRule.setNumQuestions(quizRuleRequest.getNumQuestions());
            quizRule.setCategory(category);
            quizRule.setQuiz(quiz);

            return quizRule;
        }).toList();
        Integer numberOfQuestions = quizRules.stream()
                .map(QuizRule::getNumQuestions)
                .reduce(0, Integer::sum);

        quiz.setTitle(quizRequest.getTitle());
        quiz.setDuration(quizRequest.getDuration());
        quiz.setCreatedAt(LocalDateTime.now());
        quiz.setTotalQuest(numberOfQuestions);
        quiz.setUser(user);
        quiz.setQuizRules(quizRules);
        return mapToQuizResponse(quizRepository.save(quiz));
    }

    @Override
    public QuizResponse updateQuiz(Long id, QuizRequest quizRequest) {
        return null;
    }

    @Override
    public void deleteQuiz(Long id) {
        quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + id));
    }


    @Override
    public QuizVariantResponse playQuiz(Long quizId) {
        List<QuizVariant>variants=quizVariantRepository.findByQuizId(quizId);
        if(variants.isEmpty()){
            throw  new RuntimeException("quiz variant size equal 0");
        }
        Random random = new Random();
        int randomIndex = random.nextInt(variants.size()); // pick random from list quizVariant
        QuizVariant quizVariant = variants.get(randomIndex);
        return quizVariantService.mapToDTO(quizVariant);
    }

    @Override
    public QuizResult submitQuiz(QuizSubmission quizSubmission) {
        User user=userRepository.findById(quizSubmission.getUserId())
                .orElseThrow(()-> new ResourceNotFoundException("User not found with id: " +quizSubmission.getUserId()));
        QuizVariant quizVariant=quizVariantRepository.findById(quizSubmission.getQuizVariantId())
                .orElseThrow(()->new ResourceNotFoundException("Quiz variant not found with id: "+quizSubmission.getQuizVariantId()));
        QuizVariantAttempt quizVariantAttempt=new QuizVariantAttempt();
        quizVariantAttempt.setVariant(quizVariant);
        quizVariantAttempt.setUser(user);
        quizVariantAttempt.setStartTime(quizSubmission.getStartTime());
        quizVariantAttempt.setEndTime(quizSubmission.getEndTime());
        List<UserAnswer>userAnswers=new ArrayList<>();
        Integer correctQuest=0;
        for(AnswerInput answerInput:quizSubmission.getAnserInputList()){
            Question question=questionRepository.findById(answerInput.getQuestionId())
                    .orElseThrow(()-> new ResourceNotFoundException("question not found with id: "+answerInput.getQuestionId()));
            Answer answer=answerRepository.findById(answerInput.getAnswerId())
                    .orElseThrow(()->new ResourceNotFoundException("answer not found with id: "+answerInput.getAnswerId()));
            UserAnswer userAnswer=new UserAnswer();
            userAnswer.setAttempt(quizVariantAttempt);
            userAnswer.setSelectedAnswer(answer);
            userAnswer.setQuestion(question);
            if(answer.getIsCorrect()){
                correctQuest++;
            }
            userAnswer.setCorrect(answer.getIsCorrect());
            userAnswers.add(userAnswer);
        }
        int score = (int) Math.round((double) correctQuest / quizVariant.getTotalQuest() * 10);
        quizVariantAttempt.setScore(score);
        quizVariantAttempt.setUserAnswers(userAnswers);
        quizVariantAttemptRepository.save(quizVariantAttempt);
        QuizResult quizResult=new QuizResult();
        quizResult.setScore(score);
        quizResult.setTotal(quizVariant.getTotalQuest());
        quizResult.setCorrectCount(correctQuest);
        return quizResult;
    }

    QuizResponse mapToQuizResponse(Quiz quiz) {
        QuizResponse quizResponse = new QuizResponse();
        quizResponse.setId(quiz.getId());
        quizResponse.setTitle(quiz.getTitle());
        quizResponse.setTotalQuest(quiz.getTotalQuest());
        quizResponse.setDuration(quiz.getDuration());
        quizResponse.setCreatedAt(quiz.getCreatedAt());
        List<QuizRuleResponse>quizRuleResponses = quiz.getQuizRules().stream().map(quizRule -> {
            CategoryResponse categoryResponse= new CategoryResponse();
            categoryResponse.setId(quizRule.getCategory().getId());
            categoryResponse.setName(quizRule.getCategory().getName());
            categoryResponse.setDescription(quizRule.getCategory().getDescription());
            QuizRuleResponse quizRuleResponse = new QuizRuleResponse();
            quizRuleResponse.setId(quizRule.getId());
            quizRuleResponse.setDifficulty(quizRule.getDifficulty());
            quizRuleResponse.setNumQuestions(quizRule.getNumQuestions());
            return quizRuleResponse;
        }).toList();
        quizResponse.setQuizRuleResponses(quizRuleResponses);
        return quizResponse;
    }
}
