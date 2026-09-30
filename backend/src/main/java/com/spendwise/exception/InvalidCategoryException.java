package com.spendwise.exception;

public class InvalidCategoryException extends RuntimeException {
    public InvalidCategoryException(String category) {
        super("Invalid category: " + category);
    }
}

