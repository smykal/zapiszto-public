package com.zapiszto.controllers.clients.serializer;

import com.zapiszto.controllers.account.entity.User;
import com.zapiszto.controllers.account.repository.UserRepository;
import com.zapiszto.controllers.clients.dto.ClientDto;
import com.zapiszto.controllers.clients.entity.ClientEntity;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@AllArgsConstructor
public class ClientsSerializer {

  @Autowired
  UserRepository userRepository;

  public ClientDto convert(ClientEntity clientEntity) {
    Long userId = clientEntity.getUserId();

    if (userId != null) {
      try {
        User userEntity = userRepository.getReferenceById(userId);
        return new ClientDto(
            clientEntity.getId(),
            clientEntity.getClientName(),
            userId,
            userEntity.getUsername()
        );
      } catch (IllegalArgumentException e) {
        log.warn("User with ID {} not found", userId, e);
      }
    }

    // Jeżeli `userId` jest `null` lub użytkownik nie istnieje
    return new ClientDto(
        clientEntity.getId(),
        clientEntity.getClientName(),
        userId != null ? userId : 0,
        "brak"
    );
  }
}

