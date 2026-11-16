package com.zapiszto.controllers.program.diagrams.dto;

import java.util.List;
import java.util.UUID;

public record ExerciseStatsForMesocycleDto(
    UUID mesocycleId,
    String label,
    Integer orderId,
    List<ExerciseStatsDto> exerciseStatsDtoList
) {
}
