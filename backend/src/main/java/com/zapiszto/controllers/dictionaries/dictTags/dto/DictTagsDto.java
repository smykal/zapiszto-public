package com.zapiszto.controllers.dictionaries.dictTags.dto;

import com.zapiszto.controllers.dictionaries.dictTags.dictTagsCategory.dto.DictTagsCategoryDto;
import java.util.UUID;

public record DictTagsDto(
    UUID id,
    String dict,
    DictTagsCategoryDto category,
    UUID dict_id,
    String name,
    String description) {}
