package com.zapiszto.controllers.exercises.dto;

import java.util.UUID;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ExerciseSessionDto {
  String exerciseId;
  UUID sessionId;
  String dictExerciseName;
  UUID dictExerciseId;
  String dictCategoryName;
  String dictCategoryId;
  Integer quantity;
  String dictQuantityTypeName;
  UUID dictQuantityTypeId;
  Float volume;
  String dictUnitName;
  UUID dictUnitNameId;
  String notes;
  int orderNumber;
  Integer restTime;
  String tempo;
  String dictSessionPartName;
  UUID dictSessionPartId;
  Integer sets;
  String equipmentName;
  UUID  dictEquipmentId;
  String equipmentAttribute;
  Float weightPerSide;
  Integer duration;
  Boolean executed;
  Boolean hasAttachment;
}
