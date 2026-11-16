package com.zapiszto.controllers.dictionaries.dictCategory.dto;

import java.util.HashMap;
import java.util.UUID;

public record NewDictCategoryDto(
    UUID id,
    HashMap<String, String> name,
    HashMap<String, String> description) {
}
