package com.zapiszto.controllers.dictionaries.dictTags.dictTagsCategory.serializer;

import com.zapiszto.controllers.dictionaries.dictLanguages.options.Languages;
import com.zapiszto.controllers.dictionaries.dictTags.dictTagsCategory.dto.DictTagsCategoryDto;
import com.zapiszto.controllers.dictionaries.dictTags.dictTagsCategory.dto.NewDictTagsCategoryDto;
import com.zapiszto.controllers.dictionaries.dictTags.dictTagsCategory.entity.DictTagsCategoryEntity;
import com.zapiszto.utilities.translator.Translations;
import org.springframework.stereotype.Component;

@Component
public class DictTagsCategorySerializer extends Translations {

  public DictTagsCategoryDto convert(DictTagsCategoryEntity dictTagsCategoryEntity, Languages language) {
    return new DictTagsCategoryDto(
        dictTagsCategoryEntity.getId(),
        translate(dictTagsCategoryEntity.getName(), language)
    );
  }

  public DictTagsCategoryEntity convert(NewDictTagsCategoryDto dictTagsCategoryDto) {
    return DictTagsCategoryEntity.builder()
        .id(dictTagsCategoryDto.id())
        .name(dictTagsCategoryDto.name())
        .build();
  }
}
