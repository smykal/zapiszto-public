package com.zapiszto.controllers.program.clientProgramView.dto;

import java.util.UUID;

public record ClientProgramExerciseDto(
    UUID exerciseId,
    int orderId,
    String purpose,
    UUID purposeId,
    String category,
    String exercise,
    UUID dictExerciseId,
    Float weight,
    String weightUnit,
    Integer repetitions,
    String repetitionsUnit,
    Boolean executed,
    Boolean hasAttachment

) {
}
