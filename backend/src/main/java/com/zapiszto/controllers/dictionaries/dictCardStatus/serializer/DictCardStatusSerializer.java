package com.zapiszto.controllers.dictionaries.dictCardStatus.serializer;

import com.zapiszto.controllers.dictionaries.dictCardStatus.dto.DictCardStatusDto;
import com.zapiszto.controllers.dictionaries.dictCardStatus.entity.DictCardStatusEntity;
import com.zapiszto.controllers.dictionaries.dictLanguages.options.Languages;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class DictCardStatusSerializer {

  public DictCardStatusDto toDto(DictCardStatusEntity entity, Languages language) {
    if (entity == null) return null;

    return new DictCardStatusDto(
        entity.getId(),
        entity.getStatusName().get(language.toString())
    );
  }

  public List<DictCardStatusDto> toDtoList(List<DictCardStatusEntity> entities, Languages language) {
    if (entities == null || entities.isEmpty()) return List.of();

    return entities.stream()
        .map(entity -> toDto(entity, language))
        .collect(Collectors.toList());
  }
}