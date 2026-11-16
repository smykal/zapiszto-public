package com.zapiszto.controllers.bodyParams.serializer;

import com.zapiszto.controllers.bodyParams.dto.BmiCategory;
import com.zapiszto.controllers.bodyParams.dto.BodyMassIndexDto;
import com.zapiszto.controllers.bodyParams.dto.BodyParamsDto;
import com.zapiszto.controllers.bodyParams.dto.BodyParamsWithNameAndDateDto;
import com.zapiszto.controllers.bodyParams.dto.BodyParamsWithNameDto;
import com.zapiszto.controllers.bodyParams.entity.BodyParamsEntity;
import com.zapiszto.controllers.dictionaries.dictBodyParams.entity.DictBodyParamsEntity;
import com.zapiszto.controllers.dictionaries.dictLanguages.options.Languages;
import com.zapiszto.utilities.translator.Translations;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@AllArgsConstructor
public class BodyParamsSerializer extends Translations {

  public BodyParamsEntity convertToEntityFromDto(BodyParamsDto bodyParamsDto, DictBodyParamsEntity dictBodyParamsEntity, Long userId) {

    return BodyParamsEntity.builder()
        .dictBodyParams(dictBodyParamsEntity)
        .value(bodyParamsDto.value())
        .userId(userId)
        .clientId(bodyParamsDto.clientId())
        .build();
  }

  public List<BodyParamsWithNameDto> convertEntityListToDtoWithParamName(List<BodyParamsEntity> bodyParamsEntityList, Languages language) {
    return bodyParamsEntityList.stream()
        .map(bodyParamsEntity -> BodyParamsWithNameDto
            .builder()
            .dict_body_params_name(translate(bodyParamsEntity.getDictBodyParams().getName(), language))
            .value(bodyParamsEntity.getValue())
            .userId(bodyParamsEntity.getCreatedByEntity()
                .getUsername())
            .build())
        .collect(Collectors.toList());
  }

  public List<BodyParamsWithNameAndDateDto> convert(List<BodyParamsEntity> bodyParamsEntityList, Languages language) {
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    return bodyParamsEntityList.stream()
        .map(bodyParamsEntity -> BodyParamsWithNameAndDateDto
            .builder()
            .id(bodyParamsEntity.getId())
            .dict_body_params_name(translate(bodyParamsEntity.getDictBodyParams().getName(), language))
            .value(Float.valueOf(bodyParamsEntity.getValue()))
            .insert_date(bodyParamsEntity.getInsert_date())
            .createdBy(bodyParamsEntity.getCreatedByEntity().getUsername())
            .build())
        .collect(Collectors.toList());  }

  public BodyParamsWithNameAndDateDto convert(BodyParamsEntity bodyParamsEntity, Languages language) {
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    return BodyParamsWithNameAndDateDto
            .builder()
            .id(bodyParamsEntity.getId())
            .dict_body_params_name(translate(bodyParamsEntity.getDictBodyParams().getName(), language))
            .value(Float.valueOf(bodyParamsEntity.getValue()))
            .insert_date(bodyParamsEntity.getInsert_date())
            .createdBy(bodyParamsEntity.getCreatedByEntity().getUsername())
            .build();
       }

  public List<BodyMassIndexDto> convert(List<BodyParamsEntity> bodyParamsEntities, int height){
    return bodyParamsEntities.stream()
        .map(bodyParamsEntity -> BodyMassIndexDto.builder()
            .value(calculateBmi(bodyParamsEntity.getValue(), height))
            .date(bodyParamsEntity.getInsert_date())
            .weight(Double.parseDouble (bodyParamsEntity.getValue()))
            .description(getBmiDescription(bodyParamsEntity.getValue(), height))
            .build())
        .collect(Collectors.toList());
  }

  private double calculateBmi(String value, int height) {
    double weight = Double.parseDouble(value);
    double heightInMeters = height / 100.0;
    double bmi = weight / (heightInMeters * heightInMeters);
    return Math.round(bmi * 100.0) / 100.0; // Zaokrąglenie do 2 miejsc
  }

  private String getBmiDescription(String value, int height) {
    var bmi = calculateBmi(value, height);
    for (BmiCategory category : BmiCategory.values()) {
      if (bmi >= category.getRange()[0] && bmi < category.getRange()[1]) {
        return category.getDescriptionPL();
      }
    }
    return "Nieznany";
  }
}
