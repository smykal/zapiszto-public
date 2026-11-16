package com.zapiszto.controllers.bodyPhotos.serializer;

import com.zapiszto.controllers.bodyPhotos.dto.BodyPhotoDto;
import com.zapiszto.controllers.bodyPhotos.entity.BodyPhotoEntity;
import com.zapiszto.utilities.aws.CloudFrontSignerService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class BodyPhotoSerializer {

  @Autowired
  CloudFrontSignerService cloudFrontSignerService;

  public BodyPhotoDto convert(BodyPhotoEntity entity) {
    var url = cloudFrontSignerService.sign(entity.getPhotoFolder() + entity.getPhotoName());
    return new BodyPhotoDto(
        entity.getId(),
        url,
        entity.getOrderNumber(),
        entity.getDate()
    );
  }

  public List<BodyPhotoDto> convert(List<BodyPhotoEntity> entities) {
    return entities.stream()
        .map(this::convert)
        .toList();
  }
}
