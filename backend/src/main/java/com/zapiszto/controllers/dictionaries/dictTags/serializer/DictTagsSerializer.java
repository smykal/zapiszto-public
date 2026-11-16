package com.zapiszto.controllers.dictionaries.dictTags.serializer;

import com.zapiszto.controllers.common.SerializerCommon;
import com.zapiszto.controllers.dictionaries.dictLanguages.options.Languages;
import com.zapiszto.controllers.dictionaries.dictTags.dictTagsCategory.dto.DictTagsCategoryDto;
import com.zapiszto.controllers.dictionaries.dictTags.dto.DictTagsDto;
import com.zapiszto.controllers.dictionaries.dictTags.entity.DictTagsEntity;
import com.zapiszto.utilities.translator.Translations;
import org.springframework.stereotype.Component;

@Component
public class DictTagsSerializer extends Translations implements SerializerCommon {

  public DictTagsDto convert(DictTagsEntity dictTagsEntity, Languages language) {
    boolean isTagBasic = dictTagsEntity.getDictTagsBasicEntity() != null;
    var dictTagsCategoryDto = new DictTagsCategoryDto(
        dictTagsEntity.getDictTagsCategoryEntity().getId(),
        translate( dictTagsEntity.getDictTagsCategoryEntity().getName(), language)
    );

    if (isTagBasic) {
      return new DictTagsDto(
          dictTagsEntity.getId(),
          BASIC,
          dictTagsCategoryDto,
          dictTagsEntity.getDictTagsBasicEntity().getId(),
          translate( dictTagsEntity.getDictTagsBasicEntity().getName(), language),
          translate( dictTagsEntity.getDictTagsBasicEntity().getDescription(), language)
      );
    } else {
      return new DictTagsDto(
          dictTagsEntity.getId(),
          PER_USER,
          dictTagsCategoryDto,
          dictTagsEntity.getDictTagsPerUserEntity().getId(),
          translate( dictTagsEntity.getDictTagsPerUserEntity().getName(), language),
          translate( dictTagsEntity.getDictTagsPerUserEntity().getDescription(), language)
      );
    }
  }
}
