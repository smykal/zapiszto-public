package com.zapiszto.controllers.dictionaries.dictTags.dictTagsCategory.dto;

import java.util.HashMap;
import java.util.UUID;

public record NewDictTagsCategoryDto(
    UUID id,
    HashMap<String, String> name
) {
}
