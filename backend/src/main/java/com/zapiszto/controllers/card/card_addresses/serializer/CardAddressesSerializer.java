package com.zapiszto.controllers.card.card_addresses.serializer;

import com.zapiszto.controllers.card.card_addresses.dto.CardAddressDto;
import com.zapiszto.controllers.card.card_addresses.dto.NewCardAddressDto;
import com.zapiszto.controllers.card.card_addresses.entity.CardAddressEntity;
import com.zapiszto.controllers.card.repository.CardRepository;
import com.zapiszto.controllers.dictionaries.dictLanguages.options.Languages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CardAddressesSerializer {

  @Autowired
  CardRepository cardRepository;

  public CardAddressEntity convert(NewCardAddressDto dto){
    return CardAddressEntity.builder()
        .cardIdUuid(dto.cardId())
        .gymName(dto.gymName())
        .gymAddress(dto.gymAddress())
        .city(dto.city())
        .dictCountryId(dto.countryId())
        .build();
  }

  public CardAddressDto convert(CardAddressEntity entity, Languages language) {
    return new CardAddressDto(
        entity.getId(),
        entity.getGymName(),
        entity.getGymAddress(),
        entity.getCity(),
        entity.getDictCountry() != null
                ? entity.getDictCountry().getCountryName().getOrDefault(language.toString(), "pl")
                : null);
  }
}
