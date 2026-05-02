package com.minhhuu.quizz.repository;

import com.minhhuu.quizz.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    boolean existsByUserName(String username);

    boolean existsByEmail(String email);

    boolean existsByUserNameAndIdNot(String username, Long id);

    boolean existsByEmailAndIdNot(String email, Long id);
}
