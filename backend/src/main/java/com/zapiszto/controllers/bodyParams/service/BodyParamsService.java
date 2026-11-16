package com.zapiszto.controllers.bodyParams.service;

import com.zapiszto.controllers.bodyParams.dto.BodyMassIndexDto;
import com.zapiszto.controllers.bodyParams.dto.BodyParamsDto;
import com.zapiszto.controllers.bodyParams.dto.BodyParamsWithNameAndDateDto;
import com.zapiszto.controllers.bodyParams.dto.BodyParamsWithNameDto;
import com.zapiszto.controllers.bodyParams.serializer.BodyParamsSerializer;
import com.zapiszto.controllers.bodyParams.repository.BodyParamsRepository;
import com.zapiszto.controllers.clients.entity.ClientEntity;
import com.zapiszto.controllers.clients.repository.ClientsRepository;
import com.zapiszto.controllers.dictionaries.dictBodyParams.repository.DictBodyParamsRepository;
import com.zapiszto.controllers.userDetails.repository.UserDetailsRepository;
import com.zapiszto.utilities.encryption.EncryptionUtil;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.aop.AopInvocationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@AllArgsConstructor
public class BodyParamsService {

  @Autowired
  private BodyParamsRepository bodyParamsRepository;

  @Autowired
  private BodyParamsSerializer bodyParamsSerializer;

  @Autowired
  private DictBodyParamsRepository dictBodyParamsRepository;

  @Autowired
  private ClientsRepository clientsRepository;

  @Autowired
  private UserDetailsRepository userDetailsRepository;

  @Autowired
  private EncryptionUtil encryptionUtil;

  public void saveBodyParam(BodyParamsDto bodyParamsDto, Long createdBy) {
    Long userId = null;
    var dictBodyParamEntity = dictBodyParamsRepository.getDictBodyParamById(bodyParamsDto.dict_body_params_id());
    if(bodyParamsDto.clientId() != null) {
      var userIdByClientId = clientsRepository.getByClientId(bodyParamsDto.clientId());
      userId = userIdByClientId.getUserId();
    } else {
      userId = createdBy;
    }
    var bodyParamEntity = bodyParamsSerializer.convertToEntityFromDto(bodyParamsDto, dictBodyParamEntity, userId);
    bodyParamEntity.setInsert_date(ZonedDateTime.now());
    bodyParamEntity.setCreatedBy(createdBy);
    bodyParamsRepository.save(bodyParamEntity);
  }

  public List<BodyParamsWithNameAndDateDto> getAllBodyParameters(Long userId) {
    var allBodyParams = bodyParamsRepository.getAllByUserId(userId);
    var language = userDetailsRepository.userLanguage(userId);

    return bodyParamsSerializer.convert(allBodyParams, language);
  }

  public List<BodyParamsWithNameAndDateDto> getAllBodyParameters(Long userId, Long trainerId, UUID clientId) throws Exception {
    if (clientId != null) {
      var allBodyParams = bodyParamsRepository.getAllByClientId(clientId);
      var language = userDetailsRepository.userLanguage(trainerId);

      return bodyParamsSerializer.convert(allBodyParams, language);
    } else {
      if (!checkIfUserBelongsToTrainer(userId, trainerId)) {
        throw new Exception("User does not belong to the trainer.");
      }
      var allBodyParams = bodyParamsRepository.getAllByUserId(userId);
      var language = userDetailsRepository.userLanguage(userId);

      return bodyParamsSerializer.convert(allBodyParams, language);
    }
  }

  public List<BodyParamsWithNameDto> getActualBodyParametersWithName(Long userId) {
    var actualBodyParamsById = bodyParamsRepository.getActualBodyParamsByUserId(userId);
    var language = userDetailsRepository.userLanguage(userId);

    return bodyParamsSerializer.convertEntityListToDtoWithParamName(actualBodyParamsById, language);
  }

  public List<BodyParamsWithNameDto> getActualBodyParametersWithName(Long userId, Long trainerId, UUID clientId) throws Exception {
    if (clientId != null) {
      var actualBodyParamsById = bodyParamsRepository.getActualBodyParamsByClientId(clientId);
      var language = userDetailsRepository.userLanguage(trainerId);
      return bodyParamsSerializer.convertEntityListToDtoWithParamName(actualBodyParamsById, language);

    } else {
      if (!checkIfUserBelongsToTrainer(userId, trainerId)) {
        throw new Exception("User does not belong to the trainer.");
      }
      var actualBodyParamsById = bodyParamsRepository.getActualBodyParamsByUserId(userId);
      var language = userDetailsRepository.userLanguage(userId);
      return bodyParamsSerializer.convertEntityListToDtoWithParamName(actualBodyParamsById, language);
    }
  }

  public List<BodyMassIndexDto> getBodyMassIndex(Long userId) {
    try {
      var bodyHeightString = bodyParamsRepository.getLastHeight(userId);
      log.info("Pobrany wzrost dla userId {}: {}", userId, bodyHeightString);

      if (bodyHeightString == null) {
        log.warn("Brak danych wzrostu dla użytkownika: {}", userId);
        return List.of(new BodyMassIndexDto()); // Możesz zwrócić pustą listę zamiast rzucać wyjątek
      }

      var bodyHeightInteger = encryptionUtil.decrypt(String.valueOf(bodyHeightString));
      var bodyParamsEntities = bodyParamsRepository.getWeight(userId);
      return bodyParamsSerializer.convert(bodyParamsEntities, Integer.valueOf(bodyHeightInteger));

    } catch (AopInvocationException e) {
      throw new RuntimeException("Error retrieving body mass index", e);
    }
  }

  public boolean checkIfUserBelongsToTrainer(Long userId, Long trainerId){
    List<ClientEntity> allByTrainerId = clientsRepository.getAllByTrainerId(trainerId);
    return allByTrainerId.stream()
        .anyMatch(clientEntity -> Objects.equals(clientEntity.getUserId(), userId));
  }

  @Modifying
  @Transactional
  public void deleteBodyParam(Long userId, Integer itemToDelete) {
    var isAllowed = checkIfBodyParamBelongsToUser(userId, itemToDelete);
    if (isAllowed) {
      bodyParamsRepository.deleteBodyParamByUserIdAndParamId(userId, itemToDelete);
    }
  }

  public BodyParamsWithNameAndDateDto updateBodyParam(Long userId, BodyParamsWithNameAndDateDto bodyParamsWithNameAndDateDto) {
    var language = userDetailsRepository.userLanguage(userId);
    var itemToUpdate = bodyParamsWithNameAndDateDto.getId();
    var isAllowed = checkIfBodyParamBelongsToUser(userId, itemToUpdate);
    if (isAllowed) {
      var itemToUpdateEntity = bodyParamsRepository.getReferenceById(itemToUpdate);
      itemToUpdateEntity.setValue(String.valueOf(bodyParamsWithNameAndDateDto.getValue()));
      itemToUpdateEntity.setInsert_date(bodyParamsWithNameAndDateDto.getInsert_date());
      var bodyParamEntity = bodyParamsRepository.save(itemToUpdateEntity);
      return bodyParamsSerializer.convert(bodyParamEntity, language);
    }
    return null;
  }

  private boolean checkIfBodyParamBelongsToUser(Long userId, Integer itemToDelete) {
    return bodyParamsRepository.checkIfBodyParamBelongsToUser(userId, itemToDelete);
  }
}
