package com.minhhuu.quizz.repository;

import com.minhhuu.quizz.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    @Query(value = """
        SELECT * FROM questions
        WHERE category_id = :categoryId
          AND difficulty = :difficulty
        ORDER BY RAND()
        LIMIT :limit
        """, nativeQuery = true)
    List<Question> findRandomByCategoryAndDifficulty(
            @Param("categoryId") Long categoryId,
            @Param("difficulty") String difficulty,
            @Param("limit") int limit);
}
