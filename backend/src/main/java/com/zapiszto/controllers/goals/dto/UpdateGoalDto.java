package com.zapiszto.controllers.goals.dto;

import java.util.UUID;

public record UpdateGoalDto(
    UUID id,
    UUID clientId,
    Integer dictBodyParamId,
    UUID dictBodyTestId,
    UUID dictUnitId,
    String action,
    String value,
    String goalDate) {
}
