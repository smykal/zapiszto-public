package com.zapiszto.controllers.exercises.dto;

import java.util.UUID;

public record LastExerciseTrainingDataDto(
    Integer quantity,
    UUID dictQuantityTypeId,
    Float volume,
    UUID dictUnitId
) {
}
