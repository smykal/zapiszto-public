package com.zapiszto.controllers.execrisesAttachments.dto;

import java.util.UUID;

public record NewExerciseAttachmentDto(
    UUID exerciseId,
    UUID dictExerciseId
) {
}
