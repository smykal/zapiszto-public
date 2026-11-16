package com.zapiszto.controllers.trainings.service;

import com.zapiszto.controllers.exercises.entity.ExerciseEntity;
import com.zapiszto.controllers.exercises.repository.ExerciseTrainingRepository;
import com.zapiszto.controllers.trainings.dto.TrainingDateDto;
import com.zapiszto.controllers.trainings.dto.TrainingDto;
import com.zapiszto.controllers.trainings.dto.TrainingNotesDto;
import com.zapiszto.controllers.trainings.repository.TrainingsRepository;
import com.zapiszto.controllers.trainings.dto.NewTrainingDto;
import com.zapiszto.controllers.trainings.entity.TrainingEntity;
import com.zapiszto.controllers.trainings.serializer.TrainingSerializer;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@AllArgsConstructor
public class TrainingsService {

  @Autowired
  TrainingsRepository trainingsRepository;

  @Autowired
  ExerciseTrainingRepository exerciseTrainingRepository;

  public void addTraining(NewTrainingDto newTrainingDto) {
    ZonedDateTime zonedDateTime = ZonedDateTime.parse(newTrainingDto.getDate(), DateTimeFormatter.ISO_DATE_TIME);

    TrainingEntity trainingEntity = TrainingEntity.builder()
        .workbooks_id(newTrainingDto.getWorkbook_id())
        .date(zonedDateTime)
        .build();

    trainingsRepository.save(trainingEntity);
    log.info("dodano nowy trening dla workbook_id: {}, z datą: {}", newTrainingDto.getWorkbook_id(), zonedDateTime);
  }

  public List<TrainingDto> getTrainings(int workbookId, Long userId) {
    List<TrainingEntity> trainings = trainingsRepository.getTrainings(userId, workbookId);
    return trainings.stream()
        .map(TrainingSerializer::convert)
        .collect(Collectors.toList());
  }

  public void updateTrainingNotes(TrainingNotesDto trainingNotesDto) {
    TrainingEntity trainingEntity = TrainingEntity.builder()
        .id(trainingNotesDto.getId())
        .notes(trainingNotesDto.getNotes())
        .build();
    trainingsRepository.save(trainingEntity);
  }

  public void updateTrainingDate(TrainingDateDto trainingDateDto) {
    LocalDate date = LocalDate.parse(trainingDateDto.getDate());

    TrainingEntity trainingEntity = trainingsRepository
        .findById(trainingDateDto.getId())
        .orElseThrow(() -> new RuntimeException("Training not found"));

    trainingEntity.setDate(
        date.atTime(15, 0).atZone(ZoneId.of("Europe/Warsaw"))
    );

    trainingsRepository.save(trainingEntity);
  }

  @Transactional
  public void deleteTraining(Long userId, int trainingId) {
    try {
      TrainingEntity trainingEntity = trainingsRepository.getByUserIdTrainingId(userId, trainingId);
      trainingsRepository.delete(trainingEntity);
      log.info("deleted training with id {}, for user {}", trainingId, userId);
    } catch (Exception e) {
      log.error("could't delete tra with id {}, user {}", trainingId, userId);
    }
  }

  @Transactional
  public void copyTraining(int trainingId, Long userId) {
    TrainingEntity trainingOldEntity = trainingsRepository.getByUserIdTrainingId(userId, trainingId);
    ZonedDateTime zonedDateTime = ZonedDateTime.now();
    var trainingNewEntity = TrainingEntity.builder()
        .workbooks_id(trainingOldEntity.getWorkbooks_id())
        .date(zonedDateTime)
        .build();
    trainingNewEntity = trainingsRepository.save(trainingNewEntity);
    var exercisesListOld = trainingOldEntity.getExercises();

    for (ExerciseEntity oldExercise : exercisesListOld) {
      ExerciseEntity newExercise = ExerciseEntity.builder()
          .id(UUID.randomUUID())
          .trainingEntity(trainingNewEntity)
          .dictExercisesEntity(oldExercise.getDictExercisesEntity())
          .dictExerciseId(oldExercise.getDictExerciseId())
          .quantity(oldExercise.getQuantity())
          .dictQuantityTypeEntity(oldExercise.getDictQuantityTypeEntity())
          .dictQuantityTypeId(oldExercise.getDictQuantityTypeId())
          .volume(oldExercise.getVolume())
          .dictUnitsEntity(oldExercise.getDictUnitsEntity())
          .dictUnitId(oldExercise.getDictUnitId())
          .notes(oldExercise.getNotes())
          .orderNumber(oldExercise.getOrderNumber())
          .restTime(oldExercise.getRestTime())
          .tempo(oldExercise.getTempo())
          .dictSessionPartEntity(oldExercise.getDictSessionPartEntity())
          .dictSessionPartId(oldExercise.getDictSessionPartId())
          .sets(oldExercise.getSets())
          .dictEquipmentEntity(oldExercise.getDictEquipmentEntity())
          .dictEquipmentId(oldExercise.getDictEquipmentId())
          .equipmentAttribute(oldExercise.getEquipmentAttribute())
          .weightPerSide(oldExercise.getWeightPerSide())
          .duration(oldExercise.getDuration())
          .hasAttachment(oldExercise.getHasAttachment())
          .build();

      exerciseTrainingRepository.save(newExercise);
      log.info("Skopiowano exercise z ID {} dla użytkownika {} do nowego exercise z ID {}", oldExercise.getId(), userId, newExercise.getId());

    }
    log.info("Skopiowano trening z ID {} dla użytkownika {} do nowego treningu z ID {}", trainingId, userId, trainingNewEntity.getId());
  }
}
