package com.zapiszto.controllers.dictionaries.dictExercises.dto;

import java.util.HashMap;
import java.util.UUID;

public record TranslationsDictExercisesDto(
    UUID id,
    HashMap<String, String> name
) {}
