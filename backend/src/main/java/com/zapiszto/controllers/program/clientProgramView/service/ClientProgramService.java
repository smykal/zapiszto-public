package com.zapiszto.controllers.program.clientProgramView.service;

import com.zapiszto.controllers.clients.entity.ClientEntity;
import com.zapiszto.controllers.clients.repository.ClientsRepository;
import com.zapiszto.controllers.dictionaries.dictEquipment.repository.DictEquipmentRepository;
import com.zapiszto.controllers.dictionaries.dictExercises.repository.DictExercisesRepository;
import com.zapiszto.controllers.dictionaries.dictQuantityType.repository.DictQuantityTypeRepository;
import com.zapiszto.controllers.dictionaries.dictSessionPart.repository.DictSessionPartRepository;
import com.zapiszto.controllers.dictionaries.dictUnits.repository.DictUnitsRepository;
import com.zapiszto.controllers.execrisesAttachments.repository.ExercisesAttachmentsRepository;
import com.zapiszto.controllers.exercises.entity.ExerciseEntity;
import com.zapiszto.controllers.exercises.serializer.ExerciseSerializer;
import com.zapiszto.controllers.program.clientProgramView.dto.*;
import com.zapiszto.controllers.program.clientProgramView.repository.ClientProgramRepository;
import com.zapiszto.controllers.program.macrocycle.entity.MacrocycleEntity;
import com.zapiszto.controllers.program.mesocycle.entity.MesocycleEntity;
import com.zapiszto.controllers.program.microcycle.entity.MicrocycleEntity;
import com.zapiszto.controllers.program.sessions.entity.SessionEntity;
import com.zapiszto.controllers.userDetails.repository.UserDetailsRepository;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClientProgramService {

  @Autowired
  ClientProgramRepository clientProgramRepository;

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
  ClientsRepository clientsRepository;

  @Autowired
  UserDetailsRepository userDetailsRepository;

  @Autowired
  ExercisesAttachmentsRepository exercisesAttachmentsRepository;


  public List<ClientProgramDto> getClientProgramsByClientId(UUID clientId) {
      ClientEntity clientEntity = clientsRepository.getByClientId(clientId);
      var trainerId = clientEntity.getTrainerId();
    List<MacrocycleEntity> macrocycles = clientProgramRepository.getAllForClientOrUser(clientId, trainerId);

    // Convert MacrocycleEntities to ClientProgramDtos
    return macrocycles.stream().map(x -> convertToClientProgramDto(x, trainerId)).collect(Collectors.toList());
  }


  public List<ClientProgramDto> getClientProgramsByUserId(Long userId) {
    Optional<ClientEntity> clientEntity = clientsRepository.getByUserId(userId);

    if (clientEntity.isPresent()){
      var trainerId = clientEntity.get().getTrainerId();
      List<MacrocycleEntity> macrocycles = clientProgramRepository.getAllForClientOrUser(null, userId);
      return macrocycles.stream().map(x -> convertToClientProgramDto(x, trainerId)).collect(Collectors.toList());
    }
    return null;
  }

  private ClientProgramDto convertToClientProgramDto(MacrocycleEntity macrocycleEntity, Long trainerId) {
    List<ClientProgramMacrocycleDto> macrocycles = List.of(new ClientProgramMacrocycleDto(
        macrocycleEntity.getId(),
        macrocycleEntity.getMesocycles().stream().map(x -> convertToClientProgramMesocycleDto(x, trainerId)).collect(Collectors.toList())
    ));

    return new ClientProgramDto(macrocycleEntity.getProgramEntity().getName(), macrocycles);
  }

  private ClientProgramMesocycleDto convertToClientProgramMesocycleDto(MesocycleEntity mesocycleEntity, Long trainerId) {
    return new ClientProgramMesocycleDto(
        mesocycleEntity.getOrderId(),
        mesocycleEntity.getMicrocycles().stream()
            .filter(MicrocycleEntity::isShare)
            .map(x -> convertToClientProgramMicrocycleDto(x, trainerId)).collect(Collectors.toList())
    );
  }

  private ClientProgramMicrocycleDto convertToClientProgramMicrocycleDto(MicrocycleEntity microcycleEntity, Long trainerId) {
    return new ClientProgramMicrocycleDto(
        microcycleEntity.getOrderId(),
        microcycleEntity.getSessions().stream().map(x -> convertToClientProgramSessionDto(x, trainerId)).collect(Collectors.toList())
    );
  }

  private ClientProgramSessionDto convertToClientProgramSessionDto(SessionEntity sessionEntity, Long trainerId) {
    var hasAttachments = exercisesAttachmentsRepository.getDictExercisesWithAttachments(trainerId);
    return new ClientProgramSessionDto(
        sessionEntity.getOrderId(),
        sessionEntity.getExercises().stream().map(ex -> convertToClientProgramExerciseDto(ex, trainerId, hasAttachments)).collect(Collectors.toList())
    );
  }

  private ClientProgramExerciseDto convertToClientProgramExerciseDto(ExerciseEntity exerciseEntity, Long trainerId, Set<UUID> hasAttachments) {
    var dictExercises = dictExercisesRepository.getAllForUser(trainerId);
    var hasAttachment = hasAttachments.contains(exerciseEntity.getDictExerciseId());
    var dictQuantityType = dictQuantityTypeRepository.getAllForUser(trainerId);
    var dictUnits = dictUnitsRepository.getAllForUser(trainerId);
    var dictSessionParts = dictSessionPartRepository.getAllForUser(trainerId);
    var dictEquipment = dictEquipmentRepository.getAllForUser(trainerId);
    var userLanguage = userDetailsRepository.userLanguage(trainerId);

    var dictCategoryName = ExerciseSerializer.getDictCategoryName(dictExercises, exerciseEntity.getDictExerciseId());
    var exerciseName = ExerciseSerializer.getExerciseName(dictExercises, exerciseEntity.getDictExerciseId(), userLanguage);
    var dictExerciseId = exerciseEntity.getDictExerciseId();
    var repetitionsUnit = ExerciseSerializer.getQuantityTypeName(dictQuantityType, exerciseEntity.getDictQuantityTypeId(), userLanguage);
    var weightUnit = ExerciseSerializer.getUnitName(dictUnits, exerciseEntity.getDictUnitId(), userLanguage);
    var purpose = ExerciseSerializer.getSessionPartName(dictSessionParts, exerciseEntity.getDictSessionPartId());
    var purposeId = exerciseEntity.getDictSessionPartId();

    return new ClientProgramExerciseDto(
        exerciseEntity.getId(),
        exerciseEntity.getOrderNumber(),
        purpose,
        purposeId,
        dictCategoryName,
        exerciseName,
        dictExerciseId,
        exerciseEntity.getVolume(),
        weightUnit,
        exerciseEntity.getQuantity(),
        repetitionsUnit,
        exerciseEntity.getExecuted(),
        hasAttachment
    );
  }
}
