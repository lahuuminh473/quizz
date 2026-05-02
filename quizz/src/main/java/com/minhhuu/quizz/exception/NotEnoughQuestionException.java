package com.minhhuu.quizz.exception;

public class NotEnoughQuestionException extends RuntimeException {
    public NotEnoughQuestionException(String message) {
        super(message);
    }
}
