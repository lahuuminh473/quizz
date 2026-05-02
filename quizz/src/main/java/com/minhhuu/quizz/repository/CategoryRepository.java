package com.minhhuu.quizz.repository;

import com.minhhuu.quizz.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category,Long> {
    boolean existsByName(String name);


    boolean existsByNameAndIdNot(String name, Long id);
}
