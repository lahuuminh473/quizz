package com.minhhuu.quizz.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Table(name = "quiz_attempts")
public class QuizVariantAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private User user;
    @ManyToOne
    private QuizVariant variant;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private int score;
    @OneToMany(mappedBy ="attempt",cascade = CascadeType.ALL)
    private List<UserAnswer> userAnswers;
}
