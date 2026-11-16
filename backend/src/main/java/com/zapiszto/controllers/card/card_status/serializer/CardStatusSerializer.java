package com.zapiszto.controllers.card.card_status.serializer;

import com.zapiszto.controllers.card.card_status.dto.CardStatusDto;
import com.zapiszto.controllers.card.card_status.entity.CardStatusEntity;
import com.zapiszto.controllers.dictionaries.dictCardStatus.entity.DictCardStatusEntity;
import com.zapiszto.controllers.dictionaries.dictLanguages.options.Languages;
import com.zapiszto.utilities.translator.Translations;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@AllArgsConstructor
public class CardStatusSerializer extends Translations {

  public CardStatusEntity toEntity(CardStatusDto cardStatusDto) {
    return CardStatusEntity.builder()
        .cardId(cardStatusDto.cardId())
        .datetime(LocalDateTime.now())
        .dictCardStatusId(cardStatusDto.dictCardStatusId())
        .comment(cardStatusDto.comment())
        .build();
  }
}
