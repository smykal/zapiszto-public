package com.zapiszto.controllers.bodyPhotos.bodyPhotosTags.serializer;

import com.zapiszto.controllers.bodyPhotos.bodyPhotosTags.dto.BodyPhotoTagDto;
import com.zapiszto.controllers.bodyPhotos.bodyPhotosTags.dto.TagDto;
import com.zapiszto.controllers.bodyPhotos.bodyPhotosTags.entity.BodyPhotoTagEntity;
import com.zapiszto.controllers.dictionaries.dictLanguages.options.Languages;
import com.zapiszto.utilities.translator.Translations;
import org.springframework.stereotype.Component;

@Component
public class BodyPhotoTagsSerializer extends Translations {

  public BodyPhotoTagDto convert(BodyPhotoTagEntity bodyPhotoTagEntity, Languages language) {
    if (bodyPhotoTagEntity.getDictTag().getDictTagsBasicEntity().getId() != null) {
      return new BodyPhotoTagDto(
          bodyPhotoTagEntity.getId(),
          new TagDto( bodyPhotoTagEntity.getDictTag().getId(),
                      translate( bodyPhotoTagEntity.getDictTag().getDictTagsBasicEntity().getName(), language))
      );
    } else {
      return new BodyPhotoTagDto(
          bodyPhotoTagEntity.getId(),
          new TagDto( bodyPhotoTagEntity.getDictTag().getId(),
                      translate( bodyPhotoTagEntity.getDictTag().getDictTagsPerUserEntity().getName(), language))
      );
    }
  }
}
