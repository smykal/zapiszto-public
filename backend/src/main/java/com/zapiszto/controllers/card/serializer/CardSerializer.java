package com.zapiszto.controllers.card.serializer;

import com.zapiszto.controllers.card.card_addresses.serializer.CardAddressesSerializer;
import com.zapiszto.controllers.card.card_addresses.service.CardAddressesService;
import com.zapiszto.controllers.card.card_photos.serializer.CardPhotoSerializer;
import com.zapiszto.controllers.card.card_photos.service.CardPhotosService;
import com.zapiszto.controllers.card.dto.CardDto;
import com.zapiszto.controllers.card.dto.CardViewDto;
import com.zapiszto.controllers.card.entity.CardEntity;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CardSerializer {

  @Autowired
  CardPhotosService cardPhotosService;

  @Autowired
  CardAddressesService cardAddressesService;

  public static CardDto convert(CardEntity entity) {
    return new CardDto(
        entity.getId(),
        entity.getTitle(),
        entity.getDescription(),
        entity.getExperience(),
        entity.getPhone(),
        entity.getMail(),
        entity.getInstagram(),
        entity.getWww(),
        entity.getOnline()
    );
  }

  public static CardEntity convert(CardDto cardDto, Long userId) {

    return CardEntity.builder()
        .userId(userId)
        .title(cardDto.title())
        .description(cardDto.description())
        .experience(cardDto.experience())
        .phone(cardDto.phone())
        .mail(cardDto.mail())
        .instagram(cardDto.instagram())
        .www(cardDto.www())
        .online(cardDto.online())
        .build();

  }

  public  CardViewDto convertToCardViewDto(CardEntity card) {
    var cardAddresses = cardAddressesService.getAddressesByCardId(card.getId(), card.getUserId());
    var cardPhotos = cardPhotosService.getPhotos(card.getId());

    return new CardViewDto(
        card.getId(),
        card.getTitle(),
        card.getDescription(),
        card.getExperience(),
        card.getPhone(),
        card.getMail(),
        card.getInstagram(),
        card.getWww(),
        card.getOnline(),
        cardAddresses,
        cardPhotos
    );
  }
}
