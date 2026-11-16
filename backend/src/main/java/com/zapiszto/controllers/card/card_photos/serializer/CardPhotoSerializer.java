package com.zapiszto.controllers.card.card_photos.serializer;

import com.zapiszto.controllers.card.card_photos.dto.CardPhotoDto;
import com.zapiszto.controllers.card.card_photos.entity.CardPhotoEntity;
import com.zapiszto.utilities.aws.CloudFrontSignerService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CardPhotoSerializer {

  @Autowired
  CloudFrontSignerService cloudFrontSignerService;

  public CardPhotoDto convert(CardPhotoEntity entity) {
    var photoPath = entity.getPhotoFolder() + entity.getPhotoName();
    return new CardPhotoDto(
        entity.getId(),
        entity.getCard().getId(),
        cloudFrontSignerService.sign(photoPath),
        entity.getOrderNumber()
    );
  }

  public List<CardPhotoDto> convert(List<CardPhotoEntity> entityList) {
    return entityList.stream().map(this::convert).toList();
  }

}
