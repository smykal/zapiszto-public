package com.zapiszto.controllers.dictionaries.dictBodyTest.dto;

import java.util.HashMap;
import java.util.UUID;

public record TranslationsDictBodyTestDto(
    UUID id,
    HashMap<String, String> name,
    HashMap<String, String> description,
    HashMap<String, String> purpose
) {
}
