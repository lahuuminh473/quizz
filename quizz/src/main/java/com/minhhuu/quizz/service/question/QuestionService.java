package com.minhhuu.quizz.service.question;

import com.minhhuu.quizz.dto.*;
import com.minhhuu.quizz.entity.Answer;
import com.minhhuu.quizz.entity.Category;
import com.minhhuu.quizz.entity.Question;
import com.minhhuu.quizz.repository.CategoryRepository;
import com.minhhuu.quizz.repository.QuestionRepository;
import com.minhhuu.quizz.service.question.IQuestionService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService implements IQuestionService {
    private final CategoryRepository categoryRepository;
    private final QuestionRepository questionRepository;


    public QuestionService(CategoryRepository categoryRepository, QuestionRepository questionRepository) {
        this.categoryRepository = categoryRepository;
        this.questionRepository = questionRepository;

    }

    @Override
    public List<QuestionResponse> getAllQuestions() {
        return questionRepository.findAll().stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    public QuestionResponse getQuestionById(Long id) {
        return questionRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(()-> new RuntimeException("Question not found with id: " + id));
    }

    @Override
    public QuestionResponse createQuestion(QuestionRequest request) {
        Category category=categoryRepository.findById(request.getCategoryId())
                .orElseThrow(()-> new RuntimeException("Category not found with id: " + request.getCategoryId()));
        Question question=new Question();
        question.setContent(request.getContent());
        question.setDifficulty(request.getDifficulty());
        question.setCategory(category);
        if(request.getAnswers().size()<2){
            throw new RuntimeException("A question must have at least two answers.");
        }
        int count=0;
        for(AnswerRequest answerRequest:request.getAnswers()){
            if(answerRequest.getIsCorrect()){
                count++;
            }
            if(count>1){
                throw  new RuntimeException("Question must have one correct answer");
            }
        }
        List<Answer>answerList=request.getAnswers().stream().map(answerRequest -> {
            Answer answer=new Answer();
            answer.setText(answerRequest.getText());
            answer.setQuestion(question);
            answer.setIsCorrect(answerRequest.getIsCorrect());
            return answer;
        }).toList();
        question.setAnswers(answerList);
       return mapToDTO(questionRepository.save(question));
    }

    @Override
    public QuestionResponse updateQuestion(Long id, QuestionRequest request) {
        Question question=questionRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Question not found with id: " + id));
        Category category=categoryRepository.findById(request.getCategoryId())
                .orElseThrow(()-> new RuntimeException("Category not found with id: " + request.getCategoryId()));
        question.setContent(request.getContent());
        question.setDifficulty(request.getDifficulty());
        question.setCategory(category);
        return mapToDTO(questionRepository.save(question));
    }

    @Override
    public void deleteQuestion(Long id) {
        Question question=questionRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Question not found with id: " + id));
        questionRepository.delete(question);
    }
    public QuestionResponse mapToDTO(Question question) {
        CategoryResponse categoryResponse = new CategoryResponse();
        categoryResponse.setId(question.getCategory().getId());
        categoryResponse.setName(question.getCategory().getName());
        categoryResponse.setDescription(question.getCategory().getDescription());
        List<AnswerResponse>answerResponses = question.getAnswers().stream().map(answer -> {
            AnswerResponse answerResponse = new AnswerResponse();
            answerResponse.setId(answer.getId());
            answerResponse.setText(answer.getText());
            return answerResponse;
        }).toList();
        QuestionResponse response = new QuestionResponse();
        response.setId(question.getId());
        response.setContent(question.getContent());
        response.setDifficulty(question.getDifficulty());
        response.setCategory(categoryResponse);
        response.setAnswers(answerResponses);
        return response;
    }
}
