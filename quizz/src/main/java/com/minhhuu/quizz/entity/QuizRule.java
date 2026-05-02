package com.minhhuu.quizz.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "quiz_rules")
public class QuizRule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Quiz quiz;

    @ManyToOne
    private Category category;

    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;

    private int numQuestions;
}
