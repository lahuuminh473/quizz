package com.minhhuu.quizz.repository;

import com.minhhuu.quizz.entity.QuizVariantAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizVariantAttemptRepository extends JpaRepository<QuizVariantAttempt,Long> {
    List<QuizVariantAttempt> findByUserIdOrderByStartTimeDesc(Long userId);
}
