package com.minhhuu.quizz.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class UserAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private QuizVariantAttempt attempt;

    @ManyToOne
    private Question question;

    @ManyToOne
    private Answer selectedAnswer;

    private boolean correct;
}
