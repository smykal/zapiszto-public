package com.zapiszto.controllers.dictionaries.dictTags.dto;

import java.util.HashMap;
import java.util.UUID;

public record TranslationsDictTagsDto(
    UUID id,
    HashMap<String, String> name,
    HashMap<String, String> description
) {
}
