package com.zapiszto.controllers.dictionaries.dictCategory.dto;
import lombok.Builder;

@Builder
public record ApiErrorResponse(
    String code,
    String message,
    Long count
) {}