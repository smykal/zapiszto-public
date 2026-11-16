package com.zapiszto.controllers.dictionaries.dictQuantityType.dto;

import java.util.HashMap;
import java.util.UUID;

public record TranslationsDictQuantityTypeDto(
    UUID id,
    HashMap<String, String> name,
    HashMap<String, String> shortcut
) {
}
