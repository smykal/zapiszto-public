package com.zapiszto.controllers.card.card_status.service;

import com.zapiszto.controllers.account.entity.ERole;
import com.zapiszto.controllers.card.card_status.dto.CardStatusDto;
import com.zapiszto.controllers.card.card_status.repository.CardStatusRepository;
import com.zapiszto.controllers.card.card_status.serializer.CardStatusSerializer;
import com.zapiszto.controllers.card.repository.CardRepository;
import com.zapiszto.controllers.dictionaries.dictCardStatus.dto.DictCardStatusDto;
import com.zapiszto.controllers.dictionaries.dictCardStatus.repository.DictCardStatusRepository;
import com.zapiszto.controllers.dictionaries.dictCardStatus.serializer.DictCardStatusSerializer;
import com.zapiszto.controllers.dictionaries.dictCardStatus.service.DictCardStatusService;
import com.zapiszto.controllers.userDetails.repository.UserDetailsRepository;
import com.zapiszto.controllers.userDetails.service.UserDetailsService;
import com.zapiszto.utilities.translator.Translations;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CardStatusService extends Translations {

  @Autowired
  UserDetailsRepository userDetailsRepository;

  @Autowired
  CardStatusRepository cardStatusRepository;

  @Autowired
  CardStatusSerializer cardStatusSerializer;

  @Autowired
  DictCardStatusRepository dictCardStatusRepository;

  @Autowired
  DictCardStatusSerializer dictCardStatusSerializer;

  @Autowired
  CardRepository cardRepository;

  private static final UUID APPROVED_STATUS_UUID =
      UUID.fromString("ecbe38e9-e266-415f-91b2-fd6dec214a0d");

  @Transactional
  public void updateStatus(CardStatusDto cardStatusDto, Long userId) {
    cardStatusRepository.save(cardStatusSerializer.toEntity(cardStatusDto));

    boolean approved = APPROVED_STATUS_UUID.equals(cardStatusDto.dictCardStatusId());

    cardRepository.findById(cardStatusDto.cardId()).ifPresent(card -> {
      card.setApproved(approved);
      cardRepository.save(card);
    });
  }

  public CardStatusDto getCardStatusActual(Long userId, UUID cardId) {
    var userLanguage = userDetailsRepository.userLanguage(userId);
    var dictCardStatus = dictCardStatusRepository.getActualCardStatusByCardId(cardId);
    var cardStatus = cardStatusRepository.getByCardId(cardId);

    return new CardStatusDto(
        cardStatus.getCardId(),
        dictCardStatus.getId(),
        translate(dictCardStatus.getStatusName(), userLanguage),
        cardStatus.getComment()
    );
  }

  public List<DictCardStatusDto> getCardStatusesAllowedToDo(ERole role, Long userId, UUID cardId) {
    var userLanguage = userDetailsRepository.userLanguage(userId);
    var actualStatusId = dictCardStatusRepository.getActualCardStatusByCardId(cardId)
        .getId()
        .toString();
    List<DictCardStatusDto> resultList = new ArrayList<>();

    boolean isAdminOrModerator = role.equals(ERole.ROLE_ADMIN) || role.equals(ERole.ROLE_MODERATOR);

    switch (actualStatusId) {
      case "e61edb77-e9e4-41cf-8f68-39d0daf01881": //"Initialized"
        if (isAdminOrModerator) {
          return null;
        } else {
          var sendToApprove = dictCardStatusRepository.getReferenceById(UUID.fromString("633a89a2-b0ff-4fe3-9510-ace3096d0922"));
          resultList.add(dictCardStatusSerializer.toDto(sendToApprove, userLanguage));
          return resultList;
        }
      case "633a89a2-b0ff-4fe3-9510-ace3096d0922": //"Send to approve"
        if (isAdminOrModerator) {
          var rejected = dictCardStatusRepository.getReferenceById(UUID.fromString("d4995a1a-a980-4d08-aab1-87e71bf3da18"));
          var approved = dictCardStatusRepository.getReferenceById(UUID.fromString("ecbe38e9-e266-415f-91b2-fd6dec214a0d"));
          resultList.add(dictCardStatusSerializer.toDto(rejected, userLanguage));
          resultList.add(dictCardStatusSerializer.toDto(approved, userLanguage));
          return resultList;
        } else {
          var backToEdit = dictCardStatusRepository.getReferenceById(UUID.fromString("46fadc94-d24b-41f3-a4cb-3f0a6bd9c2d7"));
          resultList.add(dictCardStatusSerializer.toDto(backToEdit, userLanguage));
          return resultList;
        }
      case "46fadc94-d24b-41f3-a4cb-3f0a6bd9c2d7": //"Back to edit"
        if (isAdminOrModerator) {
          return null;
        } else {
          var sendToApprove = dictCardStatusRepository.getReferenceById(UUID.fromString("633a89a2-b0ff-4fe3-9510-ace3096d0922"));
          resultList.add(dictCardStatusSerializer.toDto(sendToApprove, userLanguage));
          return resultList;
        }
      case "d4995a1a-a980-4d08-aab1-87e71bf3da18": //"Rejected":
        if (isAdminOrModerator) {
          return null;
        } else {
          var sendToApprove = dictCardStatusRepository.getReferenceById(UUID.fromString("633a89a2-b0ff-4fe3-9510-ace3096d0922"));
          resultList.add(dictCardStatusSerializer.toDto(sendToApprove, userLanguage));
          return resultList;
        }
      case "ecbe38e9-e266-415f-91b2-fd6dec214a0d": //"Approved"
        if (isAdminOrModerator) {
          return null;
        } else {
          var backToEdit = dictCardStatusRepository.getReferenceById(UUID.fromString("46fadc94-d24b-41f3-a4cb-3f0a6bd9c2d7"));
          resultList.add(dictCardStatusSerializer.toDto(backToEdit, userLanguage));
          return resultList;
        }
    }
    return resultList;
  }
}
