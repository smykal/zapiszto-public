package com.zapiszto.controllers.clientBodyTest.service;

import com.zapiszto.controllers.clientBodyTest.dto.ClientBodyTestDto;
import com.zapiszto.controllers.clientBodyTest.dto.NewClientBodyTestDto;
import com.zapiszto.controllers.clientBodyTest.entity.ClientBodyTestsEntity;
import com.zapiszto.controllers.clientBodyTest.repository.ClientBodyTestsRepository;
import com.zapiszto.controllers.clientBodyTest.serializer.ClientBodyTestSerializer;
import com.zapiszto.controllers.dictionaries.dictLanguages.options.Languages;
import com.zapiszto.controllers.userDetails.repository.UserDetailsRepository;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@AllArgsConstructor
public class ClientBodyTestService {

  @Autowired
  ClientBodyTestsRepository clientBodyTestsRepository;

  @Autowired
  UserDetailsRepository userDetailsRepository;

  public void addClientBodyTest(NewClientBodyTestDto newClientBodyTestDto) {
    ClientBodyTestsEntity clientBodyTestsEntity = ClientBodyTestsEntity.builder()
        .id(newClientBodyTestDto.id())
        .clientId(newClientBodyTestDto.clientId())
        .dictBodyTestId(newClientBodyTestDto.dictBodyTestId())
        .result(newClientBodyTestDto.result())
        .build();
    clientBodyTestsRepository.save(clientBodyTestsEntity);
    log.error("Add new client body test with id: {}", newClientBodyTestDto.id());

  }

  public List<ClientBodyTestDto> getClientBodyTests(UUID clientId, Long userId) {
    Languages lang = userDetailsRepository.userLanguage(userId);

    List<ClientBodyTestsEntity> allByClientId = clientBodyTestsRepository.getAllByClientId(clientId);
    return allByClientId.stream().map(clientBodyTestsEntity -> ClientBodyTestSerializer.convert(clientBodyTestsEntity, lang)).collect(Collectors.toList());

  }

  @Modifying
  public ClientBodyTestDto updateClientBodyTests(Long userId, ClientBodyTestDto clientBodyTestDto) {
    var language = userDetailsRepository.userLanguage(userId);
    var itemToUpdate = clientBodyTestDto.id();
    var isAllowed = checkIfClientBodyTestBelongsToUser(userId, itemToUpdate);
    if (isAllowed) {
      var itemToUpdateEntity = clientBodyTestsRepository.getReferenceById(itemToUpdate);
      itemToUpdateEntity.setResult(clientBodyTestDto.result());
      itemToUpdateEntity.setDictBodyTestId(clientBodyTestDto.dict_body_test_id());
      var clientBodyTestEntity = clientBodyTestsRepository.save(itemToUpdateEntity);
      return ClientBodyTestSerializer.convert(clientBodyTestEntity, language);
    }
    return null;
  }

  @Modifying
  @Transactional
  public void deleteClientBodyTest(Long userId, UUID itemToDelete) {
    var isAllowed = checkIfClientBodyTestBelongsToUser(userId, itemToDelete);
    if (isAllowed) {
      clientBodyTestsRepository.deleteClientBodyTestByUserIdAndParamId(itemToDelete);
    }
  }

  private boolean checkIfClientBodyTestBelongsToUser(Long userId, UUID itemToDelete) {
    return clientBodyTestsRepository.checkIfClientBodyTestBelongsToUser(userId, itemToDelete);
  }
}
