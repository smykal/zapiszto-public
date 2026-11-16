package com.zapiszto.controllers.dictionaries.dictCountry.serializer;

import com.zapiszto.controllers.common.SerializerCommon;
import com.zapiszto.controllers.dictionaries.dictCountry.dto.DictCountryDto;
import com.zapiszto.controllers.dictionaries.dictCountry.entity.DictCountryEntity;
import com.zapiszto.controllers.dictionaries.dictLanguages.options.Languages;
import com.zapiszto.utilities.translator.Translations;

public class DictCountrySerializer extends Translations implements SerializerCommon {

  public static DictCountryDto convert(DictCountryEntity dictCountryEntity, Languages language) {
    if (dictCountryEntity == null) {
      return null;
    }

    var countryName = translate(dictCountryEntity.getCountryName(), language);
    var countryCode = translate(dictCountryEntity.getCountryCode(), language);

    return new DictCountryDto(
        dictCountryEntity.getId(),
        countryName,
        countryCode
    );
  }
}
