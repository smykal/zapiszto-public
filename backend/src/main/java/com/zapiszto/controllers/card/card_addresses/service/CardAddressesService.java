package com.zapiszto.controllers.card.card_addresses.service;

import com.zapiszto.controllers.card.card_addresses.dto.CardAddressDto;
import com.zapiszto.controllers.card.card_addresses.dto.NewCardAddressDto;
import com.zapiszto.controllers.card.card_addresses.entity.CardAddressEntity;
import com.zapiszto.controllers.card.card_addresses.repository.CardAddressesRepository;
import com.zapiszto.controllers.card.card_addresses.serializer.CardAddressesSerializer;
import com.zapiszto.controllers.card.entity.CardEntity;
import com.zapiszto.controllers.card.repository.CardRepository;
import com.zapiszto.controllers.dictionaries.dictCountry.entity.DictCountryEntity;
import com.zapiszto.controllers.dictionaries.dictCountry.repository.DictCountryRepository;
import com.zapiszto.controllers.userDetails.repository.UserDetailsRepository;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CardAddressesService {

  @Autowired
  CardRepository cardRepository;

  @Autowired
  CardAddressesSerializer cardAddressesSerializer;

  @Autowired
  UserDetailsRepository userDetailsRepository;

  @Autowired
  CardAddressesRepository cardAddressesRepository;

  @Autowired
  DictCountryRepository dictCountryRepository;

  public List<CardAddressDto> getAddressesByCardId(java.util.UUID cardId, Long userId) {
    var language = userDetailsRepository.userLanguage(userId);

    return cardAddressesRepository.findAllByCardIdUuid(cardId).stream()
        .map(entity -> cardAddressesSerializer.convert(entity, language))
        .collect(Collectors.toList());
  }

  public CardAddressDto createAddress(NewCardAddressDto dto, Long userId) {
    var language = userDetailsRepository.userLanguage(userId);
    var cardEntity = cardRepository.findById(dto.cardId())
        .orElseThrow(() -> new RuntimeException("Card not found"));
    var dictCountryEntity = dictCountryRepository.findById(dto.countryId())
        .orElse(null);

    var entity = cardAddressesSerializer.convert(dto);
    entity.setCardId(cardEntity);
    entity.setDictCountry(dictCountryEntity);

    var saved = cardAddressesRepository.save(entity);

    return cardAddressesSerializer.convert(saved, language);
  }

  @Transactional
  public void deleteAddress(UUID addressId) {
    cardAddressesRepository.deleteAddress(addressId);
  }
}
