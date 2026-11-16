package com.zapiszto.controllers.workbooks.diagrams.dto;

import java.util.Date;

public record VolumeMaxVolumeAvgVolumeForEachExerciseEachTraining(
    String category,
    String exercise,
    Date date,
    Float volumeCol01,
    Float volumeCol02,
    Float volumeCol03,
    Float volumeCol04,
    Float volumeCol05,
    Float volumeAvg,
    Float volumeMax
) {
}
