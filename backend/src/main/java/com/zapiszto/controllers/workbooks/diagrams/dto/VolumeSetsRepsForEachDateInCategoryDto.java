package com.zapiszto.controllers.workbooks.diagrams.dto;

import java.util.Date;

public record VolumeSetsRepsForEachDateInCategoryDto(
    Date trainingWeek,
    String category,
    Long sets,
    String repetitions,
    Double volume
) {
}
