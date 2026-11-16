package com.zapiszto.controllers.dictionaries.dictCategory.dto;

import java.util.UUID;

public record DictCategoryDto(
    UUID id,
    String dict,
    UUID dict_id,
    String name,
    String description
) {}
