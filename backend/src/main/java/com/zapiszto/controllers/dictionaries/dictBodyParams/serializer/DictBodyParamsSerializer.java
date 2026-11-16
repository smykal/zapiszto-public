package com.zapiszto.controllers.dictionaries.dictBodyParams.serializer;

import com.zapiszto.controllers.dictionaries.dictBodyParams.dto.DictBodyParamsDto;
import com.zapiszto.controllers.dictionaries.dictBodyParams.dto.NewDictBodyParamDto;
import com.zapiszto.controllers.dictionaries.dictBodyParams.entity.DictBodyParamsEntity;
import com.zapiszto.controllers.dictionaries.dictLanguages.options.Languages;
import com.zapiszto.utilities.translator.Translations;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@AllArgsConstructor
public class DictBodyParamsSerializer extends Translations {

  public List<DictBodyParamsDto> convertEntityToDto(List<DictBodyParamsEntity> dictBodyParamsEntityList, Languages language) {
    return dictBodyParamsEntityList.stream()
        .map(dictBodyParamsEntity -> DictBodyParamsDto
            .builder()
            .id(dictBodyParamsEntity.getId())
            .name(translate(dictBodyParamsEntity.getName() , language))
            .description(translate(dictBodyParamsEntity.getDescription() ,language))
            .build())
        .collect(Collectors.toList());
  }

  public DictBodyParamsEntity convert (NewDictBodyParamDto dictBodyParamDto) {
    return DictBodyParamsEntity.builder()
        .name(dictBodyParamDto.name())
        .description(dictBodyParamDto.description())
        .build();
  }
}
