package com.zapiszto.controllers.exercises.serializer;

import com.zapiszto.controllers.common.SerializerCommon;
import com.zapiszto.controllers.dictionaries.dictEquipment.entity.DictEquipmentEntity;
import com.zapiszto.controllers.dictionaries.dictExercises.entity.DictExercisesEntity;
import com.zapiszto.controllers.dictionaries.dictLanguages.options.Languages;
import com.zapiszto.controllers.dictionaries.dictQuantityType.entity.DictQuantityTypeEntity;
import com.zapiszto.controllers.dictionaries.dictSessionPart.entity.DictSessionPartEntity;
import com.zapiszto.controllers.dictionaries.dictUnits.entity.DictUnitsEntity;
import com.zapiszto.controllers.exercises.dto.ExerciseSessionDto;
import com.zapiszto.controllers.exercises.dto.ExerciseTrainingDto;
import com.zapiszto.controllers.exercises.dto.LastExerciseTrainingDataDto;
import com.zapiszto.controllers.exercises.dto.NewExerciseSessionDto;
import com.zapiszto.controllers.exercises.dto.NewExerciseTrainingDto;
import com.zapiszto.controllers.exercises.entity.ExerciseEntity;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Stream;
import org.springframework.stereotype.Component;

@Component
public class ExerciseSerializer implements SerializerCommon {

  public static ExerciseEntity convert(NewExerciseTrainingDto newExerciseTrainingDto) {
    return ExerciseEntity.builder()
        .id(UUID.fromString(newExerciseTrainingDto.getId()))
        .trainingId(newExerciseTrainingDto.getTrainingId())
        .dictExerciseId(newExerciseTrainingDto.getDictExerciseId())
        .quantity(newExerciseTrainingDto.getQuantity())
        .dictQuantityTypeId(newExerciseTrainingDto.getDictQuantityTypeId())
        .volume(newExerciseTrainingDto.getVolume())
        .dictUnitId(newExerciseTrainingDto.getVolume() == null ? null : newExerciseTrainingDto.getDictUnitId())
        .notes(newExerciseTrainingDto.getNotes())
        .hasAttachment(false)
        .build();
  }

  public static ExerciseEntity convert(NewExerciseSessionDto newExerciseSessionDto) {
    return ExerciseEntity.builder()
        .id(UUID.fromString(newExerciseSessionDto.getId()))
        .trainingId(newExerciseSessionDto.getSessionId())
        .dictExerciseId(newExerciseSessionDto.getDictExerciseId())
        .quantity(newExerciseSessionDto.getQuantity())
        .dictQuantityTypeId(newExerciseSessionDto.getDictQuantityTypeId())
        .volume(newExerciseSessionDto.getVolume())
        .dictUnitId(newExerciseSessionDto.getDictUnitId())
        .notes(newExerciseSessionDto.getNotes())
        .hasAttachment(false)
        .build();
  }

  public static List<ExerciseTrainingDto> convert(
      List<ExerciseEntity> exerciseEntity,
      List<DictExercisesEntity> dictExercises,
      List<DictQuantityTypeEntity> dictQuantityType,
      List<DictUnitsEntity> dictUnits,
      Languages userLanguage
  ) {
    List<ExerciseTrainingDto> exercises = new ArrayList<>();

    for (ExerciseEntity exercise : exerciseEntity) {
      ExerciseTrainingDto exerciseTrainingDto = ExerciseTrainingDto.builder()
          .exerciseId(exercise.getId()
              .toString())
          .trainingId(exercise.getTrainingId())
          .dictExerciseName(getExerciseName(dictExercises, exercise.getDictExerciseId(), userLanguage))
          .quantity(exercise.getQuantity())
          .dictQuantityTypeName(getQuantityTypeName(dictQuantityType, exercise.getDictQuantityTypeId(), userLanguage))
          .volume(exercise.getVolume())
          .dictUnitName(getUnitName(dictUnits, exercise.getDictUnitId(), userLanguage))
          .notes(exercise.getNotes())
          .orderNumber(exercise.getOrderNumber())
          .hasAttachment(exercise.getHasAttachment())
          .build();

      exercises.add(exerciseTrainingDto);
    }
    return exercises;
  }

  public static ExerciseSessionDto convert(
      ExerciseEntity exercise,
      List<DictExercisesEntity> dictExercises,
      List<DictQuantityTypeEntity> dictQuantityType,
      List<DictUnitsEntity> dictUnits,
      List<DictSessionPartEntity> dictSessionParts,
      List<DictEquipmentEntity> dictEquipments,
      Languages userLanguage
  ) {
    return ExerciseSessionDto.builder()
        .exerciseId(exercise.getId()
            .toString())
        .sessionId(exercise.getSessionId())
        .dictExerciseName(getExerciseName(dictExercises, exercise.getDictExerciseId(), userLanguage))
        .dictExerciseId(exercise.getDictExerciseId())
        .dictCategoryName(getDictCategoryName(dictExercises, exercise.getDictExerciseId()))
        .quantity(exercise.getQuantity())
        .dictQuantityTypeName(getQuantityTypeName(dictQuantityType, exercise.getDictQuantityTypeId(), userLanguage))
        .volume(exercise.getVolume())
        .dictUnitName(getUnitName(dictUnits, exercise.getDictUnitId(), userLanguage))
        .notes(exercise.getNotes())
        .orderNumber(exercise.getOrderNumber())
        .restTime(exercise.getRestTime())
        .tempo(exercise.getTempo())
        .dictSessionPartName(getSessionPartName(dictSessionParts, exercise.getDictSessionPartId()))
        .sets(exercise.getSets())
        .equipmentName(getEquipmentName(dictEquipments, exercise.getDictEquipmentId(), userLanguage))
        .equipmentAttribute(exercise.getEquipmentAttribute())
        .weightPerSide(exercise.getWeightPerSide())
        .duration(exercise.getDuration())
        .executed(exercise.getExecuted())
        .hasAttachment(exercise.getHasAttachment())
        .build();
  }

  public static ExerciseTrainingDto convert(
      ExerciseEntity exercise,
      List<DictExercisesEntity> dictExercises,
      List<DictQuantityTypeEntity> dictQuantityType,
      List<DictUnitsEntity> dictUnits,
      Languages userLanguage
  ) {
    return ExerciseTrainingDto.builder()
        .exerciseId(exercise.getId()
            .toString())
        .dictExerciseName(getExerciseName(dictExercises, exercise.getDictExerciseId(), userLanguage))
        .quantity(exercise.getQuantity())
        .dictQuantityTypeName(getQuantityTypeName(dictQuantityType, exercise.getDictQuantityTypeId(), userLanguage))
        .volume(exercise.getVolume())
        .dictUnitName(getUnitName(dictUnits, exercise.getDictUnitId(), userLanguage))
        .notes(exercise.getNotes())
        .orderNumber(exercise.getOrderNumber())
        .hasAttachment(exercise.getHasAttachment())
        .build();

  }

  public static String getDictCategoryName(List<DictExercisesEntity> dictExercises, UUID dictExerciseId) {
    Optional<DictExercisesEntity> exerciseOptional = dictExercises.stream()
        .filter(exercise -> exercise.getId()
            .equals(dictExerciseId))
        .findFirst();

    if (exerciseOptional.isPresent()) {
      DictExercisesEntity exercise = exerciseOptional.get();
      if (exercise.getDictExercisesBasicEntity() != null) {
        Map<String, String> values = exercise.getDictExercisesBasicEntity()
            .getDictCategoryEntity()
            .getDictCategoryBasicEntity()
            .getName();
        return exercise.getDictExercisesBasicEntity()
            .getDictCategoryEntity()
            .getDictCategoryBasicEntity()
            .getName()
            .get("en");
      } else if (exercise.getDictExercisesPerUserEntity() != null) {
        if (exercise.getDictExercisesPerUserEntity()
            .getDictCategoryEntity()
            .getDictCategoryBasicEntity() != null) {
          return exercise.getDictExercisesPerUserEntity()
              .getDictCategoryEntity()
              .getDictCategoryBasicEntity()
              .getName()
              .get("en");
        } else {
          return exercise.getDictExercisesPerUserEntity()
              .getDictCategoryEntity()
              .getDictCategoryPerUserEntity()
              .getName()
              .get("en");
        }
      }
    }

    return null;
  }

  public static String getSessionPartName(List<DictSessionPartEntity> dictSessionPart, UUID dictSessionPartId) {
    Optional<DictSessionPartEntity> sessionPartOptional = dictSessionPart.stream()
        .filter(sessionPart -> sessionPart.getId()
            .equals(dictSessionPartId))
        .findFirst();

    if (sessionPartOptional.isPresent()) {
      DictSessionPartEntity exercise = sessionPartOptional.get();
      if (exercise.getDictSessionPartBasicEntity() != null) {
        return exercise.getDictSessionPartBasicEntity()
            .getName()
            .get("en");
      } else if (exercise.getDictSessionPartPerUserEntity() != null) {
        return exercise.getDictSessionPartPerUserEntity()
            .getName()
            .get("en");
      }
    }
    return null;
  }


  public static String getExerciseName(List<DictExercisesEntity> dictExercises, UUID dictExerciseId, Languages userLanguage) {
    return dictExercises.stream()
        .filter(exercise -> exercise.getId()
            .equals(dictExerciseId))
        .findFirst()
        .map(exercise -> {
          // Sprawdź w DictExercisesBasicEntity
          if (exercise.getDictExercisesBasicEntity() != null) {
            Map<String, String> names = exercise.getDictExercisesBasicEntity()
                .getName();
            return returnValueInUserLanguage(names, userLanguage);
          }
          // Sprawdź w DictExercisesPerUserEntity
          if (exercise.getDictExercisesPerUserEntity() != null) {
            Map<String, String> names = exercise.getDictExercisesPerUserEntity()
                .getName();
            return returnValueInUserLanguage(names, userLanguage);
          }
          return null;
        })
        .orElse(null);
  }

  public static String getQuantityTypeName(
      List<DictQuantityTypeEntity> dictQuantityType,
      UUID dictQuantityTypeId,
      Languages userLanguage
  ) {
    Optional<DictQuantityTypeEntity> quantityTypeEntity = dictQuantityType.stream()
        .filter(quantityType -> quantityType.getId()
            .equals(dictQuantityTypeId))
        .findFirst();

    if (quantityTypeEntity.isPresent()) {
      DictQuantityTypeEntity quantityType = quantityTypeEntity.get();
      if (quantityType.getDictQuantityTypeBasicEntity() != null) {
        Map<String, String> shortcutValues = quantityType.getDictQuantityTypeBasicEntity()
            .getShortcut();
        String shortcut = returnValueInUserLanguage(shortcutValues, userLanguage);
        if (shortcut != null && !shortcut.isEmpty()) {
          return shortcut;
        } else {
          Map<String, String> nameValues = quantityType.getDictQuantityTypeBasicEntity()
              .getName();
          return returnValueInUserLanguage(nameValues, userLanguage);
        }
      } else if (quantityType.getDictQuantityTypePerUserEntity() != null) {
        Map<String, String> shortcutValues = quantityType.getDictQuantityTypePerUserEntity()
            .getShortcut();
        String shortcut = returnValueInUserLanguage(shortcutValues, userLanguage);
        if (shortcut != null && !shortcut.isEmpty()) {
          return shortcut;
        }
        Map<String, String> nameValues = quantityType.getDictQuantityTypePerUserEntity()
            .getName();
        return returnValueInUserLanguage(nameValues, userLanguage);
      }
    }

    return null;
  }


  public static String getUnitName(List<DictUnitsEntity> dictUnits, UUID dictUnitId, Languages userLanguage) {
    Optional<DictUnitsEntity> unitEntity = dictUnits.stream()
        .filter(dictUnit -> dictUnit.getId()
            .equals(dictUnitId))
        .findFirst();

    if (unitEntity.isPresent()) {
      DictUnitsEntity dictUnitsEntity = unitEntity.get();
      if (dictUnitsEntity.getDictUnitsBasicEntity() != null) {
        Map<String, String> shortcutValues = dictUnitsEntity.getDictUnitsBasicEntity()
            .getShortcut();
//        String shortcut = dictUnitsEntity.getDictUnitsBasicEntity()
//            .getShortcut()
//            .get("en");
        String shortcut = returnValueInUserLanguage(shortcutValues, userLanguage);
        if (shortcut != null && !shortcut.isEmpty()) {
          return shortcut;
        }
        Map<String, String> nameValues = dictUnitsEntity.getDictUnitsBasicEntity()
            .getName();
        return returnValueInUserLanguage(nameValues, userLanguage);

      } else if (dictUnitsEntity.getDictUnitsPerUserEntity() != null) {
        Map<String, String> shortcutValues = dictUnitsEntity.getDictUnitsPerUserEntity()
            .getShortcut();
        String shortcut = returnValueInUserLanguage(shortcutValues, userLanguage);
        if (shortcut != null && !shortcut.isEmpty()) {
          return shortcut;
        }
        Map<String, String> nameValues = dictUnitsEntity.getDictUnitsPerUserEntity()
            .getName();
        return returnValueInUserLanguage(nameValues, userLanguage);
      }
    }
    return null;
  }

  private static String getEquipmentName(List<DictEquipmentEntity> dictEquipment, UUID dictEquipmentId, Languages userLanguage) {
    Optional<DictEquipmentEntity> exerciseOptional = dictEquipment.stream()
        .filter(exercise -> exercise.getId()
            .equals(dictEquipmentId))
        .findFirst();

    if (exerciseOptional.isPresent()) {
      DictEquipmentEntity exercise = exerciseOptional.get();
      if (exercise.getDictEquipmentBasicEntity() != null) {
        Map<String, String> values = exercise.getDictEquipmentBasicEntity()
            .getName();
        return returnValueInUserLanguage(values,userLanguage);
      } else if (exercise.getDictEquipmentPerUserEntity() != null) {
        Map<String, String> values = exercise.getDictEquipmentPerUserEntity()
            .getName();
        return returnValueInUserLanguage(values, userLanguage);
      }
    }
    return null;
  }

  public static String returnValueInUserLanguage(Map<String, String> names, Languages userLanguage) {
    if (names.containsKey(userLanguage)) {
      return names.get(userLanguage.name());
    } else {
      return Stream.of("en", "es", "it", "pl", "ru", "ua")
          .filter(names::containsKey)
          .map(names::get)
          .findFirst()
          .orElse(null);
    }
  }


  public static ExerciseEntity generateDefaultExerciseSession(UUID sessionId) {

    return ExerciseEntity.builder()
        .id(UUID.randomUUID())
        .sessionId(sessionId)
        .dictExerciseId(DEFAULT_DICT_EXERCISE_ID)
        .dictSessionPartId(DEFAULT_DICT_SESSION_PART_ID)
        .quantity(DEFAULT_QUANTITY)
        .dictQuantityTypeId(DEFAULT_DICT_QUANTITY_TYPE)
        .volume(DEFAULT_VOLUME)
        .dictUnitId(DEFAULLT_DICT_UNIT_ID)
        .notes(DEFAULT_NOTES)
        .restTime(DEFAULT_REST_TIME)
        .tempo(DEFAULT_TEMPO)
        .sets(DEFAULT_SETS)
        .build();
  }

  public static LastExerciseTrainingDataDto getLastExerciseTrainingDataDtoFromObject(ExerciseEntity exerciseEntity) {

    if (exerciseEntity == null) {
      return new LastExerciseTrainingDataDto(
          10,            // defaultowe quantity
          null,                 // dict_quantity_type_id
          0f,                   // defaultowe volume
          null                  // dict_unit_id
      );
    }
    return new LastExerciseTrainingDataDto(
        exerciseEntity.getQuantity(),
        exerciseEntity.getDictQuantityTypeId(),
        exerciseEntity.getVolume(),
        exerciseEntity.getDictUnitId()
    );
  }
}
