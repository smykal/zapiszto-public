package com.zapiszto.controllers.clients.service;

import com.zapiszto.controllers.clients.dto.ClientDto;
import com.zapiszto.controllers.clients.dto.NewClientDto;
import com.zapiszto.controllers.clients.entity.ClientEntity;
import com.zapiszto.controllers.clients.repository.ClientsRepository;
import com.zapiszto.controllers.clients.serializer.ClientsSerializer;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@AllArgsConstructor
public class ClientsService {

  @Autowired
  ClientsRepository clientsRepository;

  @Autowired
  ClientsSerializer clientsSerializer;


  public List<ClientDto> getClients(long trainerId) {
    List<ClientEntity> allByTrainerId = clientsRepository.getAllByTrainerId(trainerId);
    return allByTrainerId.stream()
        .map(clientsSerializer::convert)
        .collect(Collectors.toList());
  }

  public ClientDto getClient(UUID clientId) {
    var clientEntity = clientsRepository.getByClientId(clientId);
    return clientsSerializer.convert(clientEntity);
  }

  public void addClient(NewClientDto newClientDto, long trainerId) {
    ClientEntity clientEntity = ClientEntity.builder()
        .id(UUID.fromString(newClientDto.getId()))
        .trainerId(trainerId)
        .clientName(newClientDto.getClientName())
        .userId(newClientDto.getUserId() == 0 ? null : newClientDto.getUserId())
        .build();
    clientsRepository.save(clientEntity);
  }
  public void updateClient(ClientDto clientDto) {
    try {
      ClientEntity clientEntity = clientsRepository.getByClientId(clientDto.id());
      clientEntity.setClientName(clientDto.clientName());
      clientEntity.setUserId(clientDto.userId());
      clientsRepository.save(clientEntity);
    } catch (RuntimeException e) {
      log.error("Error updating client: {}", e.getMessage());
      throw e;
    }
  }


  public void deleteClient(UUID clientId) {
    clientsRepository.deleteByClientId(clientId);
  }

  public boolean isDeletable(UUID clientId) {
    return clientsRepository.isDeletable(clientId);
  }
}
