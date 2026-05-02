package com.minhhuu.quizz.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "quiz_variants")
public class QuizVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code; //  example code '1','2','3'
    @ManyToOne
    private Quiz quiz;
    private Integer totalQuest;
    @ManyToMany
    @JoinTable(
            name = "quiz_variant_question",
            joinColumns = @JoinColumn(name = "variant_id"),
            inverseJoinColumns = @JoinColumn(name = "question_id")
    )
    private List<Question> questions;
}
