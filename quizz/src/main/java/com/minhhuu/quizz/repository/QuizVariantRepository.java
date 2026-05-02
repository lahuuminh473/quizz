package com.minhhuu.quizz.repository;

import com.minhhuu.quizz.entity.QuizVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;

@Repository
public interface QuizVariantRepository extends JpaRepository<QuizVariant, Long> {
    List<QuizVariant> findByQuizId(Long quizId);
}
