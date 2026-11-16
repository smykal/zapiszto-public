package com.zapiszto.controllers.bodyPhotos.bodyPhotosShare.serializer;

import com.zapiszto.controllers.bodyPhotos.bodyPhotosShare.dto.BodyPhotoShareDto;
import com.zapiszto.controllers.bodyPhotos.bodyPhotosShare.entity.BodyPhotosShareEntity;
import org.springframework.stereotype.Component;

@Component
public class BodyPhotosShareSerializer {

  public BodyPhotoShareDto convert(BodyPhotosShareEntity bodyPhotosShareEntity) {
    return new BodyPhotoShareDto(
        bodyPhotosShareEntity.getId()
        ,bodyPhotosShareEntity.getUser().getId()
        ,bodyPhotosShareEntity.getUser().getUsername()
    );
  }
}
