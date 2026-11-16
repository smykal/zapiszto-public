package com.zapiszto.controllers.common.exception;

import com.zapiszto.controllers.dictionaries.dictCategory.dto.ApiErrorResponse;
import com.zapiszto.controllers.dictionaries.dictCategory.exceptions.CategoryInUseException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
    Map<String, String> errors = new HashMap<>();
    ex.getBindingResult().getFieldErrors().forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
    return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(CategoryInUseException.class)
  public ResponseEntity<ApiErrorResponse> handleCategoryInUse(CategoryInUseException ex) {

    return ResponseEntity
        .status(HttpStatus.CONFLICT)
        .body(
            ApiErrorResponse.builder()
                .code("CATEGORY_IN_USE")
                .message(ex.getMessage())
                .count(ex.getCount())
                .build()
        );
  }
}