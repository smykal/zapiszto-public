package com.zapiszto.controllers.workbooks.diagrams.dto;

import java.util.Date;

public record TrainingFrequencyDto(
    Date trainingDate,
    Integer count
) {
}
