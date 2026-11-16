package com.zapiszto.controllers.exercises.service;

import com.zapiszto.controllers.dictionaries.dictExercises.repository.DictExercisesRepository;
import com.zapiszto.controllers.dictionaries.dictQuantityType.repository.DictQuantityTypeRepository;
import com.zapiszto.controllers.dictionaries.dictUnits.repository.DictUnitsRepository;
import com.zapiszto.controllers.exercises.dto.ExerciseTrainingDto;
import com.zapiszto.controllers.exercises.dto.LastExerciseTrainingDataDto;
import com.zapiszto.controllers.exercises.dto.NewExerciseTrainingDto;
import com.zapiszto.controllers.exercises.entity.ExerciseEntity;
import com.zapiszto.controllers.exercises.repository.ExerciseTrainingRepository;
import com.zapiszto.controllers.exercises.serializer.ExerciseSerializer;
import com.zapiszto.controllers.trainings.repository.TrainingsRepository;
import com.zapiszto.controllers.userDetails.repository.UserDetailsRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
public class ExercisesTrainingService {

  @Autowired
  ExerciseTrainingRepository exerciseTrainingRepository;

  @Autowired
  DictExercisesRepository dictExercisesRepository;

  @Autowired
  DictQuantityTypeRepository dictQuantityTypeRepository;

  @Autowired
  DictUnitsRepository dictUnitsRepository;

  @Autowired
  TrainingsRepository trainingsRepository;

  @Autowired
  UserDetailsRepository userDetailsRepository;

  @Transactional
  public void addExercise(NewExerciseTrainingDto dto, Long userId, int number) {
    int count = Math.min(Math.max(number, 1), 5);

    for (int i = 0; i < count; i++) {
      addExercise(dto, userId);
    }
  }

  public void addExercise(NewExerciseTrainingDto newExerciseTrainingDto, Long userId) {
    int trainingId = newExerciseTrainingDto.getTrainingId();
    int orderNumber = exerciseTrainingRepository.getOrderNumber(userId, trainingId);
    ExerciseEntity exerciseEntity = ExerciseSerializer.convert(newExerciseTrainingDto);
    exerciseEntity.setOrderNumber(orderNumber);
    var trainingEntity = trainingsRepository.findById(trainingId)
        .orElseThrow(() -> new RuntimeException("Training not found"));

    exerciseEntity.setTrainingEntity(trainingEntity);
    ExerciseEntity save = exerciseTrainingRepository.save(exerciseEntity);
    log.info("add new exercise with id {}, training_id {}, user {}", save.getId(), save.getTrainingId(), userId);
  }


  public ExerciseTrainingDto getExercise(UUID exerciseId, Long userId) {
    var dictExercises = dictExercisesRepository.getAllForUser(userId);
    var dictQuantityType = dictQuantityTypeRepository.getAllForUser(userId);
    var dictUnits = dictUnitsRepository.getAllForUser(userId);
    var userLanguage = userDetailsRepository.userLanguage(userId);

    ExerciseEntity exercisesByTrainingId = exerciseTrainingRepository.getExercisesByExerciseId(exerciseId);

    return ExerciseSerializer.convert(
        exercisesByTrainingId,
        dictExercises,
        dictQuantityType,
        dictUnits,
        userLanguage
    );
  }

  public UUID copyExercise(UUID exerciseId, int trainingId, Long userId) {
    int orderNumber = exerciseTrainingRepository.getOrderNumber(userId, trainingId);
    var exerciseOldEntity = exerciseTrainingRepository.getExercisesByExerciseId(exerciseId);
    var trainingEntity = trainingsRepository.findById(trainingId)
        .orElseThrow(() -> new RuntimeException("Training not found"));

    var exerciseNewEntity = ExerciseEntity.builder()
        .id(UUID.randomUUID())
        .trainingEntity(trainingEntity)
        .dictExerciseId(exerciseOldEntity.getDictExerciseId())
        .quantity(exerciseOldEntity.getQuantity())
        .dictQuantityTypeId(exerciseOldEntity.getDictQuantityTypeId())
        .volume(exerciseOldEntity.getVolume())
        .dictUnitId(exerciseOldEntity.getDictUnitId())
        .notes(exerciseOldEntity.getNotes())
        .orderNumber(orderNumber)
        .hasAttachment(exerciseOldEntity.getHasAttachment())
        .build();
    ExerciseEntity save = exerciseTrainingRepository.save(exerciseNewEntity);
    log.info("add new exercise by copy exercise with id {}, training_id {}, user {}", save.getId(), save.getTrainingId(), userId);

    return save.getId();
  }


  public List<ExerciseTrainingDto> getExercises(int trainingId, Long userId) {
    var dictExercises = dictExercisesRepository.getAllForUser(userId);
    var dictQuantityType = dictQuantityTypeRepository.getAllForUser(userId);
    var dictUnits = dictUnitsRepository.getAllForUser(userId);
    var userLanguage = userDetailsRepository.userLanguage(userId);

    List<ExerciseEntity> exercisesByTrainingId = exerciseTrainingRepository.getExercisesByTrainingId(userId, trainingId);


    return ExerciseSerializer.convert(
        exercisesByTrainingId,
        dictExercises,
        dictQuantityType,
        dictUnits,
        userLanguage
    );
  }

  public LastExerciseTrainingDataDto getLastData(Long userId, UUID dictExerciseId) {
    var exerciseDataEntity = exerciseTrainingRepository.getLastExerciseTrainingData(userId, dictExerciseId);
    var exerciseDataDto = ExerciseSerializer.getLastExerciseTrainingDataDtoFromObject(exerciseDataEntity);

    return exerciseDataDto;
  }

  @Transactional
  public void deleteExercise(Long userId, int trainingId, UUID exerciseId) {
    try {
      ExerciseEntity exerciseEntity = exerciseTrainingRepository.getByUserIdTrainingIdExerciseId(userId, trainingId, exerciseId);
      exerciseTrainingRepository.delete(exerciseEntity);
      reorder(trainingId);
      log.info("deleted exercise with id {}, training {}, user {}", exerciseId, trainingId, userId);
    } catch (Exception e) {
      log.error("could't delete exercise with id {}, training {}, user {}", exerciseId, trainingId, userId);
    }
  }

  @Transactional
  public void reorder(int trainingId) {
    // Pobierz wszystkie ćwiczenia dla danego trainingId, posortowane według orderNumber
    List<ExerciseEntity> exercises = exerciseTrainingRepository.findByTrainingIdOrderByOrderNumber(trainingId);

    // Przypisz nowe wartości do kolumny orderNumber na podstawie nowego porządku
    for (int i = 0; i < exercises.size(); i++) {
      exercises.get(i)
          .setOrderNumber(i + 1);
    }

    // Zapisz zmiany w bazie danych
    exerciseTrainingRepository.saveAll(exercises);
  }

  @jakarta.transaction.Transactional
  public List<ExerciseTrainingDto> updateExerciseOrderNumberUp(Integer trainingId, UUID exerciseId, Long userId) {
    return updateOrderNumber(trainingId, exerciseId, -1, userId);
  }

  @jakarta.transaction.Transactional
  public List<ExerciseTrainingDto> updateExerciseOrderNumberDown(Integer trainingId, UUID exerciseId, Long userId) {
    return updateOrderNumber(trainingId, exerciseId, 1, userId);
  }

  private List<ExerciseTrainingDto> updateOrderNumber(Integer trainingId, UUID exerciseId, int direction, Long userId) {
    var dictExercises = dictExercisesRepository.getAllForUser(userId);
    var dictQuantityType = dictQuantityTypeRepository.getAllForUser(userId);
    var dictUnits = dictUnitsRepository.getAllForUser(userId);
    var userLanguage = userDetailsRepository.userLanguage(userId);


    List<ExerciseEntity> exerciseEntities = exerciseTrainingRepository.getAllByTrainingId(trainingId)
        .stream()
        .sorted(Comparator.comparingInt(ExerciseEntity::getOrderNumber))
        .collect(Collectors.toList());

    int index = -1;
    for (int i = 0; i < exerciseEntities.size(); i++) {
      if (exerciseEntities.get(i)
          .getId()
          .equals(exerciseId)) {
        index = i;
        break;
      }
    }

    if (index != -1 && ((direction == -1 && index > 0) || (direction == 1 && index < exerciseEntities.size() - 1))) {
      int newIndex = index + direction;
      ExerciseEntity currentExercise = exerciseEntities.get(index);
      ExerciseEntity targetExercise = exerciseEntities.get(newIndex);

      int currentOrderNumber = currentExercise.getOrderNumber();
      currentExercise.setOrderNumber(targetExercise.getOrderNumber());
      targetExercise.setOrderNumber(currentOrderNumber);

      exerciseTrainingRepository.save(currentExercise);
      exerciseTrainingRepository.save(targetExercise);
    }

    return exerciseTrainingRepository.getAllByTrainingId(trainingId)
        .stream()
        .sorted(Comparator.comparingInt(ExerciseEntity::getOrderNumber))
        .map(exercise -> ExerciseSerializer.convert(exercise, dictExercises, dictQuantityType, dictUnits, userLanguage))
        .collect(Collectors.toList());
  }

  @Transactional
  public void updateTrainingExercise(UUID exerciseId,Integer trainingId, NewExerciseTrainingDto updatedExerciseTrainingDto, Long userId) {
    ExerciseEntity exerciseEntity = exerciseTrainingRepository.getByUserIdTrainingIdExerciseId(
        userId, trainingId, exerciseId);

    if (exerciseEntity == null) {
      throw new EntityNotFoundException("Exercise entity not found with ID: " + exerciseId);
    }

    if (updatedExerciseTrainingDto.getDictExerciseId() != null) {
      exerciseEntity.setDictExerciseId(updatedExerciseTrainingDto.getDictExerciseId());
    }
    if (updatedExerciseTrainingDto.getQuantity() > 0) {
      exerciseEntity.setQuantity(updatedExerciseTrainingDto.getQuantity());
    }
    if (updatedExerciseTrainingDto.getDictQuantityTypeId() != null) {
      exerciseEntity.setDictQuantityTypeId(updatedExerciseTrainingDto.getDictQuantityTypeId());
    }
    if (updatedExerciseTrainingDto.getVolume() != null) {
      exerciseEntity.setVolume(updatedExerciseTrainingDto.getVolume());
    }
    if (updatedExerciseTrainingDto.getDictUnitId() != null) {
      exerciseEntity.setDictUnitId(updatedExerciseTrainingDto.getDictUnitId());
    }
    if (updatedExerciseTrainingDto.getNotes() != null) {
      exerciseEntity.setNotes(updatedExerciseTrainingDto.getNotes());
    }

    exerciseTrainingRepository.save(exerciseEntity);
    log.info("Updated exercise with ID: {}, for training ID: {}, user: {}", exerciseId, trainingId, userId);
  }
}
