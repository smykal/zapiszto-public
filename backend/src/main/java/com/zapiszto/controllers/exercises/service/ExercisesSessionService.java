package com.zapiszto.controllers.exercises.service;

import com.zapiszto.controllers.dictionaries.dictEquipment.repository.DictEquipmentRepository;
import com.zapiszto.controllers.dictionaries.dictExercises.repository.DictExercisesRepository;
import com.zapiszto.controllers.dictionaries.dictQuantityType.repository.DictQuantityTypeRepository;
import com.zapiszto.controllers.dictionaries.dictSessionPart.repository.DictSessionPartRepository;
import com.zapiszto.controllers.dictionaries.dictUnits.repository.DictUnitsRepository;
import com.zapiszto.controllers.execrisesAttachments.repository.ExercisesAttachmentsRepository;
import com.zapiszto.controllers.exercises.dto.CopyParametersDto;
import com.zapiszto.controllers.exercises.dto.ExerciseSessionDto;
import com.zapiszto.controllers.exercises.dto.NewExerciseSessionDto;
import com.zapiszto.controllers.exercises.dto.UpdateDictQuantityTypeDto;
import com.zapiszto.controllers.exercises.dto.UpdateDictSessionPartDto;
import com.zapiszto.controllers.exercises.dto.UpdateDictUnitDto;
import com.zapiszto.controllers.exercises.dto.UpdateDictEquipmentDto;
import com.zapiszto.controllers.exercises.dto.UpdateDurationDto;
import com.zapiszto.controllers.exercises.dto.UpdateEquipmentAttributeDto;
import com.zapiszto.controllers.exercises.dto.UpdateExerciseDto;
import com.zapiszto.controllers.exercises.dto.UpdateNotesDto;
import com.zapiszto.controllers.exercises.dto.UpdateQuantityDto;
import com.zapiszto.controllers.exercises.dto.UpdateRestTimeDto;
import com.zapiszto.controllers.exercises.dto.UpdateSetsDto;
import com.zapiszto.controllers.exercises.dto.UpdateTempoDto;
import com.zapiszto.controllers.exercises.dto.UpdateVolumeDto;
import com.zapiszto.controllers.exercises.entity.ExerciseEntity;
import com.zapiszto.controllers.exercises.repository.ExerciseSessionRepository;
import com.zapiszto.controllers.exercises.serializer.ExerciseSerializer;
import com.zapiszto.controllers.program.microcycle.service.MicrocycleService;
import com.zapiszto.controllers.program.sessions.entity.SessionEntity;
import com.zapiszto.controllers.program.sessions.repository.SessionRepository;
import com.zapiszto.controllers.program.sessions.service.SessionService;
import com.zapiszto.controllers.userDetails.repository.UserDetailsRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.transaction.Transactional;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Slf4j
@Service
public class ExercisesSessionService {
  @Autowired
  private SessionRepository sessionRepository;

  @Autowired
  ExerciseSessionRepository exerciseSessionRepository;

  @Autowired
  DictExercisesRepository dictExercisesRepository;

  @Autowired
  DictQuantityTypeRepository dictQuantityTypeRepository;

  @Autowired
  DictUnitsRepository dictUnitsRepository;

  @Autowired
  DictSessionPartRepository dictSessionPartRepository;

  @Autowired
  DictEquipmentRepository dictEquipmentRepository;

  @Autowired
  UserDetailsRepository userDetailsRepository;

  @Lazy
  @Autowired
  SessionService sessionService;

  @Autowired
  ExercisesAttachmentsRepository exercisesAttachmentsRepository;

  final String KG = "kg";
  final String PROC = "%";

  public void addExercise(NewExerciseSessionDto newExerciseSessionDto) {

    ExerciseEntity exerciseEntity = ExerciseSerializer.convert(newExerciseSessionDto);
    exerciseSessionRepository.save(exerciseEntity);
  }

  public void addExercise(UUID sessionId) {
    Integer orderId = exerciseSessionRepository.getOrderNumber(sessionId);
    for (int i = 0; i < 3; i++) {
      orderId++;
      ExerciseEntity exerciseEntity = ExerciseSerializer.generateDefaultExerciseSession(sessionId);
      exerciseEntity.setOrderNumber(orderId);
      exerciseSessionRepository.save(exerciseEntity);
    }
  }

  public List<ExerciseSessionDto> getExercises(UUID sessionId, Long userId) {
    var dictExercises = dictExercisesRepository.getAllForUser(userId);
    var dictQuantityType = dictQuantityTypeRepository.getAllForUser(userId);
    var dictUnits = dictUnitsRepository.getAllForUser(userId);
    var dictSessionParts = dictSessionPartRepository.getAllForUser(userId);
    var dictEquipment = dictEquipmentRepository.getAllForUser(userId);
    var userLanguage = userDetailsRepository.userLanguage(userId);

    List<ExerciseEntity> allBySessionId = exerciseSessionRepository.getAllBySessionId(sessionId);
    return allBySessionId.stream()
        .map(exercise -> ExerciseSerializer.convert(exercise, dictExercises, dictQuantityType, dictUnits, dictSessionParts, dictEquipment, userLanguage))
        .collect(Collectors.toList());
  }

  @Transactional
  public void updateExerciseSession(UUID id, ExerciseSessionDto dto) {
    ExerciseEntity exercise = exerciseSessionRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Exercise entity not found with ID: " + id));

    // Aktualizacja tylko przesłanych pól (zakładamy Partial DTO)
    if(dto.getDictSessionPartId() != null) {
      exercise.setDictSessionPartId(dto.getDictSessionPartId());
    }

    if(dto.getDictExerciseId() != null) {
      exercise.setDictExerciseId(dto.getDictExerciseId());
    }

    if(dto.getDictUnitNameId() != null) {
      exercise.setDictUnitId(dto.getDictUnitNameId());
    }

    if(dto.getDictQuantityTypeId() != null) {
      exercise.setDictQuantityTypeId(dto.getDictQuantityTypeId());
    }

    if (dto.getNotes() != null) {
      exercise.setNotes(dto.getNotes());
    }

    if (dto.getSets() != null) {
      exercise.setSets(dto.getSets());
    }

    if (dto.getVolume() != null) {
      exercise.setVolume(dto.getVolume());
      exercise.setWeightPerSide(countWeightPerSide(exercise.getEquipmentAttribute(), dto.getVolume()));
    }

    if (dto.getQuantity() != null) {
      exercise.setQuantity(dto.getQuantity());
    }

    if (dto.getRestTime() != null) {
      exercise.setRestTime(dto.getRestTime());
    }

    if (dto.getTempo() != null) {
      exercise.setTempo(dto.getTempo().toUpperCase());
    }

    if (dto.getDictEquipmentId() != null) {
      exercise.setDictEquipmentId(dto.getDictEquipmentId());
    }

    if (dto.getEquipmentAttribute() != null) {
      exercise.setEquipmentAttribute(dto.getEquipmentAttribute());
    }

    if (dto.getDuration() != null) {
      exercise.setDuration(dto.getDuration());
    }

    exerciseSessionRepository.save(exercise);
  }




  public void updateDictSessionPart(UUID id, UpdateDictSessionPartDto updateDictSessionPartDto) {
    Optional<ExerciseEntity> exerciseEntityOptional = exerciseSessionRepository.findById(id);

    if (exerciseEntityOptional.isPresent()) {
      ExerciseEntity exerciseEntity = exerciseEntityOptional.get();
      exerciseEntity.setDictSessionPartId(updateDictSessionPartDto.getId());
      exerciseSessionRepository.save(exerciseEntity);
    } else {
      throw new EntityNotFoundException("Exercise entity not found with ID: " + id);
    }
  }

  public void updateDictQuantityType(UUID id, UpdateDictQuantityTypeDto updateDictQuantityTypeDto) {
    Optional<ExerciseEntity> exerciseEntityOptional = exerciseSessionRepository.findById(id);

    if (exerciseEntityOptional.isPresent()) {
      ExerciseEntity exerciseEntity = exerciseEntityOptional.get();
      exerciseEntity.setDictQuantityTypeId(updateDictQuantityTypeDto.getId());
      exerciseSessionRepository.save(exerciseEntity);
    } else {
      throw new EntityNotFoundException("Exercise entity not found with ID: " + id);
    }
  }

  public void updateNotes(UUID id, UpdateNotesDto updateNotesDto) {
    Optional<ExerciseEntity> exerciseEntityOptional = exerciseSessionRepository.findById(id);

    if (exerciseEntityOptional.isPresent()) {
      ExerciseEntity exerciseEntity = exerciseEntityOptional.get();
      exerciseEntity.setNotes(updateNotesDto.getNotes());
      exerciseSessionRepository.save(exerciseEntity);
    } else {
      throw new EntityNotFoundException("Exercise entity not found with ID: " + id);
    }
  }

  public void updateTempo(UUID id, UpdateTempoDto updateTempoDto) {
    Optional<ExerciseEntity> exerciseEntityOptional = exerciseSessionRepository.findById(id);

    if (exerciseEntityOptional.isPresent()) {
      ExerciseEntity exerciseEntity = exerciseEntityOptional.get();
      exerciseEntity.setTempo(updateTempoDto.getTempo()
          .toUpperCase());
      exerciseSessionRepository.save(exerciseEntity);
    } else {
      throw new EntityNotFoundException("Exercise entity not found with ID: " + id);
    }
  }

  public void updateRestTime(UUID id, UpdateRestTimeDto updateRestTimeDto) {
    Optional<ExerciseEntity> exerciseEntityOptional = exerciseSessionRepository.findById(id);

    if (exerciseEntityOptional.isPresent()) {
      ExerciseEntity exerciseEntity = exerciseEntityOptional.get();
      exerciseEntity.setRestTime(updateRestTimeDto.getRestTime());
      exerciseSessionRepository.save(exerciseEntity);
    } else {
      throw new EntityNotFoundException("Exercise entity not found with ID: " + id);
    }
  }

  public Float updateVolume(UUID id, UpdateVolumeDto updateVolumeDto) {
    Optional<ExerciseEntity> exerciseEntityOptional = exerciseSessionRepository.findById(id);

    if (exerciseEntityOptional.isPresent()) {
      ExerciseEntity exerciseEntity = exerciseEntityOptional.get();
      exerciseEntity.setVolume(updateVolumeDto.getVolume());
      exerciseEntity.setWeightPerSide(countWeightPerSide(
          exerciseEntity.getEquipmentAttribute(),
          exerciseEntity.getVolume()
      ));

      exerciseSessionRepository.save(exerciseEntity);
      return exerciseEntity.getWeightPerSide();

    } else {
      throw new EntityNotFoundException("Exercise entity not found with ID: " + id);
    }
  }

  public void updateQuantity(UUID id, UpdateQuantityDto updateQuantityDto) {
    Optional<ExerciseEntity> exerciseEntityOptional = exerciseSessionRepository.findById(id);

    if (exerciseEntityOptional.isPresent()) {
      ExerciseEntity exerciseEntity = exerciseEntityOptional.get();
      exerciseEntity.setQuantity(updateQuantityDto.getQuantity());
      exerciseSessionRepository.save(exerciseEntity);
    } else {
      throw new EntityNotFoundException("Exercise entity not found with ID: " + id);
    }
  }

  public void updateExercise(UUID id, UpdateExerciseDto updateExerciseDto) {
    Optional<ExerciseEntity> exerciseEntityOptional = exerciseSessionRepository.findById(id);

    if (exerciseEntityOptional.isPresent()) {
      ExerciseEntity exerciseEntity = exerciseEntityOptional.get();
      exerciseEntity.setDictExerciseId(updateExerciseDto.getId());
      exerciseSessionRepository.save(exerciseEntity);
    } else {
      throw new EntityNotFoundException("Exercise entity not found with ID: " + id);
    }
  }

  public void updateDictUnit(UUID id, UpdateDictUnitDto updateDictUnitDto) {
    Optional<ExerciseEntity> exerciseEntityOptional = exerciseSessionRepository.findById(id);

    if (exerciseEntityOptional.isPresent()) {
      ExerciseEntity exerciseEntity = exerciseEntityOptional.get();
      exerciseEntity.setDictUnitId(updateDictUnitDto.getDictUnitId());
      exerciseSessionRepository.save(exerciseEntity);
    } else {
      throw new EntityNotFoundException("Exercise entity not found with ID: " + id);
    }
  }

  public void updateSets(UUID id, UpdateSetsDto updateSetsDto) {
    Optional<ExerciseEntity> exerciseEntityOptional = exerciseSessionRepository.findById(id);

    if (exerciseEntityOptional.isPresent()) {
      ExerciseEntity exerciseEntity = exerciseEntityOptional.get();
      exerciseEntity.setSets(updateSetsDto.getSets());
      exerciseSessionRepository.save(exerciseEntity);
    } else {
      throw new EntityNotFoundException("Exercise entity not found with ID: " + id);
    }
  }

  public void updateDuration(UUID id, UpdateDurationDto updateDurationDto) {
    Optional<ExerciseEntity> exerciseEntityOptional = exerciseSessionRepository.findById(id);

    if (exerciseEntityOptional.isPresent()) {
      ExerciseEntity exerciseEntity = exerciseEntityOptional.get();
      exerciseEntity.setDuration(updateDurationDto.getDuration());
      exerciseSessionRepository.save(exerciseEntity);
    } else {
      throw new EntityNotFoundException("Exercise entity not found with ID: " + id);
    }
  }

  public void updateExerciseExecuted(UUID exerciseId, Long userId) {
    Optional<ExerciseEntity> exerciseEntityOptional = exerciseSessionRepository.findById(exerciseId);

    if (exerciseEntityOptional.isPresent()) {
      ExerciseEntity exerciseEntity = exerciseEntityOptional.get();
      exerciseEntity.setExecuted(true);
      exerciseEntity.setExecutedSetBy(userId);
      exerciseEntity.setExecutedSetDatetime(ZonedDateTime.now());

      exerciseSessionRepository.save(exerciseEntity);
    } else {
      throw new EntityNotFoundException("Exercise entity not found with ID: " + exerciseId);
    }
  }


  public void updateDictEquipment(UUID id, UpdateDictEquipmentDto updateDictEquipmentDto) {
    Optional<ExerciseEntity> exerciseEntityOptional = exerciseSessionRepository.findById(id);

    if (exerciseEntityOptional.isPresent()) {
      ExerciseEntity exerciseEntity = exerciseEntityOptional.get();
      exerciseEntity.setDictEquipmentId(updateDictEquipmentDto.getDictEquipmentId());
      exerciseSessionRepository.save(exerciseEntity);
    } else {
      throw new EntityNotFoundException("Exercise entity not found with ID: " + id);
    }
  }

  public Float updateEquipmentAttribute(UUID id, UpdateEquipmentAttributeDto updateEquipmentAttributeDto) {
    Optional<ExerciseEntity> exerciseEntityOptional = exerciseSessionRepository.findById(id);

    if (exerciseEntityOptional.isPresent()) {
      ExerciseEntity exerciseEntity = exerciseEntityOptional.get();
      exerciseEntity.setEquipmentAttribute(updateEquipmentAttributeDto.getEquipmentAttribute());

      exerciseEntity.setWeightPerSide(countWeightPerSide(
          updateEquipmentAttributeDto.getEquipmentAttribute(),
          exerciseEntity.getVolume()
      ));

      exerciseSessionRepository.save(exerciseEntity);
      return exerciseEntity.getWeightPerSide();
    } else {
      // Handle the case where the entity was not found, e.g., throw an exception or return null
      throw new EntityNotFoundException("ExerciseEntity not found for ID: " + id);
    }
  }

  @Transactional
  public List<ExerciseSessionDto> delete(UUID sessionId, UUID exerciseId, Long userId) {
    var dictExercises = dictExercisesRepository.getAllForUser(userId);
    var dictQuantityType = dictQuantityTypeRepository.getAllForUser(userId);
    var dictUnits = dictUnitsRepository.getAllForUser(userId);
    var dictSessionParts = dictSessionPartRepository.getAllForUser(userId);
    var dictEquipment = dictEquipmentRepository.getAllForUser(userId);
    var userLanguage = userDetailsRepository.userLanguage(userId);
    exerciseSessionRepository.deleteById(exerciseId);
    List<ExerciseEntity> exerciseEntities = exerciseSessionRepository.getAllBySessionId(sessionId);

    for (int i = 0; i < exerciseEntities.size(); i++) {
      ExerciseEntity exercise = exerciseEntities.get(i);
      exercise.setOrderNumber(i + 1); // Numeracja od 1
    }

    List<ExerciseEntity> entities = exerciseSessionRepository.saveAll(exerciseEntities);
    return entities.stream()
        .map(exercise -> ExerciseSerializer.convert(exercise, dictExercises, dictQuantityType, dictUnits, dictSessionParts, dictEquipment, userLanguage))
        .collect(Collectors.toList());
  }

  @Transactional
  public List<ExerciseSessionDto> updateExerciseOrderNumberUp(UUID sessionId, UUID exerciseId, Long userId) {
    return updateOrderNumber(sessionId, exerciseId, -1, userId);
  }

  @Transactional
  public List<ExerciseSessionDto> updateExerciseOrderNumberDown(UUID sessionId, UUID exerciseId, Long userId) {
    return updateOrderNumber(sessionId, exerciseId, 1, userId);
  }

  private List<ExerciseSessionDto> updateOrderNumber(UUID sessionId, UUID exerciseId, int direction, Long userId) {
    var dictExercises = dictExercisesRepository.getAllForUser(userId);
    var dictQuantityType = dictQuantityTypeRepository.getAllForUser(userId);
    var dictUnits = dictUnitsRepository.getAllForUser(userId);
    var dictSessionParts = dictSessionPartRepository.getAllForUser(userId);
    var dictEquipment = dictEquipmentRepository.getAllForUser(userId);
    var userLanguage = userDetailsRepository.userLanguage(userId);

    List<ExerciseEntity> exerciseEntities = exerciseSessionRepository.getAllBySessionId(sessionId)
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

      exerciseSessionRepository.save(currentExercise);
      exerciseSessionRepository.save(targetExercise);
    }

    return exerciseSessionRepository.getAllBySessionId(sessionId)
        .stream()
        .sorted(Comparator.comparingInt(ExerciseEntity::getOrderNumber))
        .map(exercise -> ExerciseSerializer.convert(exercise, dictExercises, dictQuantityType, dictUnits, dictSessionParts, dictEquipment, userLanguage))
        .collect(Collectors.toList());
  }

  @Transactional
  public List<ExerciseSessionDto> addExerciseSession(UUID sessionId, Long userId) {
    var dictExercises = dictExercisesRepository.getAllForUser(userId);
    var dictQuantityType = dictQuantityTypeRepository.getAllForUser(userId);
    var dictUnits = dictUnitsRepository.getAllForUser(userId);
    var dictSessionParts = dictSessionPartRepository.getAllForUser(userId);
    var dictEquipment = dictEquipmentRepository.getAllForUser(userId);
    var userLanguage = userDetailsRepository.userLanguage(userId);

    List<ExerciseEntity> exerciseEntities;
    exerciseEntities = exerciseSessionRepository.getAllBySessionId(sessionId)
        .stream()
        .sorted(Comparator.comparingInt(ExerciseEntity::getOrderNumber))
        .toList();

    if (exerciseEntities.isEmpty()) {
      ExerciseEntity exerciseEntity = ExerciseSerializer.generateDefaultExerciseSession(sessionId);
      ExerciseEntity save = exerciseSessionRepository.save(exerciseEntity);

      List<ExerciseEntity> updatedExerciseEntities = exerciseSessionRepository.getAllBySessionId(sessionId)
          .stream()
          .sorted(Comparator.comparingInt(ExerciseEntity::getOrderNumber))
          .toList();

      return updatedExerciseEntities.stream()
          .map(exercise -> ExerciseSerializer.convert(exercise, dictExercises, dictQuantityType, dictUnits, dictSessionParts, dictEquipment, userLanguage))
          .collect(Collectors.toList());
    }

    ExerciseEntity lastExercise = exerciseEntities.get(exerciseEntities.size() - 1);
    ExerciseEntity newExercise = ExerciseEntity.builder()
        .id(UUID.randomUUID())
        .sessionId(sessionId)
        .trainingId(lastExercise.getTrainingId())
        .dictExerciseId(lastExercise.getDictExerciseId())
        .quantity(lastExercise.getQuantity())
        .dictQuantityTypeId(lastExercise.getDictQuantityTypeId())
        .volume(lastExercise.getVolume())
        .dictUnitId(lastExercise.getDictUnitId())
        .notes(lastExercise.getNotes())
        .orderNumber(lastExercise.getOrderNumber() + 1)
        .restTime(lastExercise.getRestTime())
        .tempo(lastExercise.getTempo())
        .dictSessionPartId(lastExercise.getDictSessionPartId())
        .sets(lastExercise.getSets())
        .dictEquipmentId(lastExercise.getDictEquipmentId())
        .equipmentAttribute(lastExercise.getEquipmentAttribute())
        .weightPerSide(lastExercise.getWeightPerSide())
        .build();

    exerciseSessionRepository.save(newExercise);

    List<ExerciseEntity> updatedExerciseEntities = exerciseSessionRepository.getAllBySessionId(sessionId)
        .stream()
        .sorted(Comparator.comparingInt(ExerciseEntity::getOrderNumber))
        .toList();

    return updatedExerciseEntities.stream()
        .map(exercise -> ExerciseSerializer.convert(exercise, dictExercises, dictQuantityType, dictUnits, dictSessionParts, dictEquipment, userLanguage))
        .collect(Collectors.toList());
  }
  @Transactional
  public ExerciseSessionDto addExerciseSession(UUID sessionId, Long userId, ExerciseSessionDto exerciseSessionDto) {
    var dictExercises = dictExercisesRepository.getAllForUser(userId);
    var dictQuantityType = dictQuantityTypeRepository.getAllForUser(userId);
    var dictUnits = dictUnitsRepository.getAllForUser(userId);
    var dictSessionParts = dictSessionPartRepository.getAllForUser(userId);
    var dictEquipment = dictEquipmentRepository.getAllForUser(userId);
    var userLanguage = userDetailsRepository.userLanguage(userId);
    var orderNumber = exerciseSessionRepository.getNextOrderNumber(sessionId);
    var hasAttachment = exercisesAttachmentsRepository.checkIfDictExerciseHasAttachment(exerciseSessionDto.getDictExerciseId());

    ExerciseEntity exerciseEntity = ExerciseEntity.builder()
        .sessionId(exerciseSessionDto.getSessionId())
        .dictExerciseId(exerciseSessionDto.getDictExerciseId())
        .quantity(exerciseSessionDto.getQuantity())
        .dictQuantityTypeId(exerciseSessionDto.getDictQuantityTypeId())
        .dictSessionPartId(exerciseSessionDto.getDictSessionPartId())
        .dictUnitId(exerciseSessionDto.getDictUnitNameId())
        .duration(exerciseSessionDto.getDuration())
        .equipmentAttribute(exerciseSessionDto.getEquipmentAttribute())
        .dictEquipmentId(exerciseSessionDto.getDictEquipmentId())
        .duration(exerciseSessionDto.getDuration())
        .orderNumber(orderNumber)
        .hasAttachment(hasAttachment)
        .build();

    var newId = exerciseSessionRepository.save(exerciseEntity).getId();
    var exercise = exerciseSessionRepository.getReferenceById(newId);
    return ExerciseSerializer.convert(exercise, dictExercises, dictQuantityType, dictUnits, dictSessionParts, dictEquipment, userLanguage);
  }


  @Transactional
  public void copyExercisesToNextDaySession(UUID sessionId, CopyParametersDto copyParametersDto) {
    SessionEntity referenceById = sessionRepository.getReferenceById(sessionId);

    //znalezienie next sesionId
    UUID nextSessionId = findNextSessionId(referenceById.getMicrocycleId(), referenceById.getOrderId());

    // Usuwanie istniejących ćwiczeń w docelowej sesji
    exerciseSessionRepository.deleteBySessionId(nextSessionId);

    // Pobranie ćwiczeń z sesji źródłowej
    List<ExerciseEntity> exercisesToCopy = exerciseSessionRepository.findBySessionId(sessionId);

    // Utworzenie nowych encji ćwiczeń dla sesji docelowej
    List<ExerciseEntity> copiedExercises = exercisesToCopy.stream()
        .map(exercise -> {
          ExerciseEntity newExercise = new ExerciseEntity();
          newExercise.setSessionId(nextSessionId);
          newExercise.setQuantity(exercise.getQuantity() + copyParametersDto.getRepetitions());
          if (copyParametersDto.getWeightIncreaseUnit()
              .equals(KG)) {
            newExercise.setVolume(exercise.getVolume() + copyParametersDto.getWeightIncrease());
          } else {
            float increase = exercise.getVolume() * copyParametersDto.getWeightIncrease() / 100;
            newExercise.setVolume(exercise.getVolume() + increase);
          }
          newExercise.setNotes(exercise.getNotes());
          newExercise.setOrderNumber(exercise.getOrderNumber());
          newExercise.setRestTime(exercise.getRestTime());
          newExercise.setTempo(exercise.getTempo());
          newExercise.setDictSessionPartId(exercise.getDictSessionPartId());
          newExercise.setDictExerciseId(exercise.getDictExerciseId());
          newExercise.setDictQuantityTypeId(exercise.getDictQuantityTypeId());
          newExercise.setDictUnitId(exercise.getDictUnitId());
          newExercise.setSets(exercise.getSets());
          newExercise.setDictEquipmentId(exercise.getDictEquipmentId());
          newExercise.setEquipmentAttribute(exercise.getEquipmentAttribute());
          newExercise.setWeightPerSide(countWeightPerSide(exercise.getEquipmentAttribute(), newExercise.getVolume()));
          newExercise.setDuration(exercise.getDuration());
          newExercise.setHasAttachment(exercise.getHasAttachment());
          return newExercise;
        })
        .collect(Collectors.toList());

    // Zapisanie nowych ćwiczeń w repozytorium
    exerciseSessionRepository.saveAll(copiedExercises);
  }

  @Transactional
  public void copyExercisesToNextWeekSession(UUID sessionId, UUID microcycleId, UUID mesocycleId, CopyParametersDto copyParametersDto) {
    //znalezienie next sesionId lub utworzenie nowej sesji
    UUID nextSessionId = findNextSessionId(sessionId)
        .orElse(createNewSession(sessionId, microcycleId, mesocycleId));

    // Usuwanie istniejących ćwiczeń w docelowej sesji
    exerciseSessionRepository.deleteBySessionId(nextSessionId);

    // Pobranie ćwiczeń z sesji źródłowej
    List<ExerciseEntity> exercisesToCopy = exerciseSessionRepository.findBySessionId(sessionId);

    // Utworzenie nowych encji ćwiczeń dla sesji docelowej
    List<ExerciseEntity> copiedExercises = exercisesToCopy.stream()
        .map(exercise -> {
          ExerciseEntity newExercise = new ExerciseEntity();
          newExercise.setSessionId(nextSessionId);
          newExercise.setQuantity(exercise.getQuantity() + copyParametersDto.getRepetitions());
          if (copyParametersDto.getWeightIncreaseUnit()
              .equals(KG)) {
            newExercise.setVolume(exercise.getVolume() + copyParametersDto.getWeightIncrease());
          } else {
            float increase = exercise.getVolume() * copyParametersDto.getWeightIncrease() / 100;
            newExercise.setVolume(exercise.getVolume() + increase);
          }
          newExercise.setNotes(exercise.getNotes());
          newExercise.setOrderNumber(exercise.getOrderNumber());
          newExercise.setRestTime(exercise.getRestTime());
          newExercise.setTempo(exercise.getTempo());
          newExercise.setDictSessionPartId(exercise.getDictSessionPartId());
          newExercise.setDictExerciseId(exercise.getDictExerciseId());
          newExercise.setDictQuantityTypeId(exercise.getDictQuantityTypeId());
          newExercise.setDictUnitId(exercise.getDictUnitId());
          newExercise.setSets(exercise.getSets());
          newExercise.setDictEquipmentId(exercise.getDictEquipmentId());
          newExercise.setEquipmentAttribute(exercise.getEquipmentAttribute());
          newExercise.setWeightPerSide(countWeightPerSide(exercise.getEquipmentAttribute(), newExercise.getVolume()));
          newExercise.setDuration(exercise.getDuration());
          newExercise.setHasAttachment(exercise.getHasAttachment());
          return newExercise;
        })
        .collect(Collectors.toList());

    // Zapisanie nowych ćwiczeń w repozytorium
    exerciseSessionRepository.saveAll(copiedExercises);
  }

  public UUID findNextSessionId(UUID currentMicrocycleId, Integer orderId) {
    // Próba znalezienia następnej sesji
    Optional<UUID> nextSessionId = sessionRepository.findNextWeekSessionId(currentMicrocycleId, orderId);

    // Jeśli jest wynik, zwracamy wartość
    if (nextSessionId.isPresent()) {
      return nextSessionId.get();
    } else {
      // Jeśli nie ma następnej sesji, dodajemy nową sesję
      sessionService.addSession(currentMicrocycleId);

      // Po dodaniu sesji, ponownie próbujemy znaleźć następną sesję
      return sessionRepository.findNextWeekSessionId(currentMicrocycleId, orderId)
          .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No next session found"));
    }
  }

  public Optional<UUID> findNextSessionId(UUID currentSessionId) {
    return sessionRepository.findNextWeekSessionId(currentSessionId);
  }

  public UUID createNewSession(UUID currentSessionId, UUID microcycleId, UUID mesocycleId) {
    return sessionService.addSession(currentSessionId, microcycleId, mesocycleId);
  }

  public Float countWeightPerSide(String equipmentAttribute, Float weight) {
    if (equipmentAttribute == null || equipmentAttribute.isEmpty()) {
      return null;
    } else {
      if (isNumericRegex(equipmentAttribute)){
        Float parsedEquipmentAttribute = Float.parseFloat(equipmentAttribute);
        return (weight - parsedEquipmentAttribute) / 2;
      } else {
        return null;
      }
    }
  }

  public static boolean isNumericRegex(String str) {
    if (str == null || str.isEmpty()) {
      return false;
    }
    String regex = "-?\\d+(\\.\\d+)?";
    return str.matches(regex);
  }
}

