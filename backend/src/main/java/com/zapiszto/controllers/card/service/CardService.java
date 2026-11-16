package com.zapiszto.controllers.card.service;

import com.zapiszto.controllers.account.entity.ERole;
import com.zapiszto.controllers.card.card_status.entity.CardStatusEntity;
import com.zapiszto.controllers.card.card_status.repository.CardStatusRepository;
import com.zapiszto.controllers.card.dto.CardDto;
import com.zapiszto.controllers.card.dto.CardViewDto;
import com.zapiszto.controllers.card.entity.CardEntity;
import com.zapiszto.controllers.card.repository.CardRepository;
import com.zapiszto.controllers.card.serializer.CardSerializer;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CardService {

  @Autowired
  CardRepository cardRepository;

  @Autowired
  CardSerializer cardSerializer;

  @Autowired
  CardStatusRepository cardStatusRepository;

  public Optional<CardDto> getCardByUserId(Long userId) {
    return cardRepository.findByUserId(userId)
        .map(CardSerializer::convert);
  }

  public CardDto getCardById(UUID id) {
    return cardRepository.findById(id)
        .map(CardSerializer::convert)
        .orElse(null);
  }



  public void createCard(CardDto cardDto, Long userId) {
    var cardEntity = CardSerializer.convert(cardDto, userId);
    cardRepository.save(cardEntity);
  }

  @Transactional
  public CardDto setUpCard(Long userId) {
    var cardEntity = CardEntity.builder()
        .userId(userId)
        .approved(false)
        .build();
    var save = cardRepository.save(cardEntity);
    var cardStatusEntity = CardStatusEntity.builder()
        .cardId(save.getId())
        .dictCardStatusId(UUID.fromString("e61edb77-e9e4-41cf-8f68-39d0daf01881"))
        .datetime(LocalDateTime.now())
        .build();
    cardStatusRepository.save(cardStatusEntity);
    return CardSerializer.convert(save);
  }

  @Transactional
  public CardDto patchCard(UUID cardId, Long userId, CardDto updatedFields) {
    var optionalCard = cardRepository.findById(cardId);

    if (optionalCard.isEmpty()) {
      throw new EntityNotFoundException("Card not found");
    }

    var card = optionalCard.get();

    if (!card.getUserId().equals(userId)) {
      throw new SecurityException("You are not allowed to edit this card");
    }

    // Aktualizuj tylko pola, które nie są null
    if (updatedFields.title() != null) card.setTitle(updatedFields.title());
    if (updatedFields.description() != null) card.setDescription(updatedFields.description());
    if (updatedFields.experience() != null) card.setExperience(updatedFields.experience());
    if (updatedFields.phone() != null) card.setPhone(updatedFields.phone());
    if (updatedFields.mail() != null) card.setMail(updatedFields.mail());
    if (updatedFields.instagram() != null) card.setInstagram(updatedFields.instagram());
    if (updatedFields.www() != null) card.setWww(updatedFields.www());
    if (updatedFields.online() != null) card.setOnline(updatedFields.online());

    var saved = cardRepository.save(card);
    return CardSerializer.convert(saved);
  }

  public CardViewDto viewCard(Long userId) {
    CardEntity card = cardRepository.findByUserId(userId)
        .orElseThrow(() -> new EntityNotFoundException("Card not found"));

    return cardSerializer.convertToCardViewDto(card);
  }

  public List<CardViewDto> getCardsRange(int from, int to, ERole role) {
    int limit = to - from;
    if (limit <= 0) limit = 10; // fallback na 10 elementów

    List<CardEntity> cards;
    boolean isAdmin = role != null && "ROLE_ADMIN".equals(role.name());

    if (isAdmin) {
      cards = cardRepository.findCardsFromToByAdmin(from, to);
    } else {
      cards = cardRepository.findCardsFromTo(from, to);
    }

    List<CardViewDto> dtos = new ArrayList<>();
    for (CardEntity card : cards) {
      dtos.add(cardSerializer.convertToCardViewDto(card));
    }
    return dtos;
  }
}
