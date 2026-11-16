package com.zapiszto.controllers.bodyPhotos.bodyPhotosTags.service;

import com.zapiszto.controllers.bodyPhotos.bodyPhotosTags.dto.BodyPhotoTagsDto;
import com.zapiszto.controllers.bodyPhotos.bodyPhotosTags.dto.TagDto;
import com.zapiszto.controllers.bodyPhotos.bodyPhotosTags.entity.BodyPhotoTagEntity;
import com.zapiszto.controllers.bodyPhotos.bodyPhotosTags.repository.BodyPhotosTagsRepository;
import com.zapiszto.controllers.bodyPhotos.bodyPhotosTags.serializer.BodyPhotoTagsSerializer;
import com.zapiszto.controllers.bodyPhotos.entity.BodyPhotoEntity;
import com.zapiszto.controllers.dictionaries.dictTags.entity.DictTagsEntity;
import com.zapiszto.controllers.userDetails.repository.UserDetailsRepository;
import com.zapiszto.controllers.userDetails.service.UserDetailsService;
import jakarta.persistence.EntityManager;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BodyPhotosTagsService {

  @Autowired
  BodyPhotosTagsRepository bodyPhotosTagsRepository;

  @Autowired
  BodyPhotoTagsSerializer bodyPhotoTagsSerializer;

  @Autowired
  EntityManager entityManager;

  @Autowired
  UserDetailsRepository userDetailsRepository;


  public BodyPhotoTagsDto getBodyPhotoTags(Long userId, UUID photoId) {
    var language = userDetailsRepository.userLanguage(userId);
    List<BodyPhotoTagEntity> entities = bodyPhotosTagsRepository.getAllTagsByPhotoId(photoId);

    if (entities.isEmpty()) {
      return new BodyPhotoTagsDto(photoId, null);
    }

    Map<UUID, String> tags = new LinkedHashMap<>();

    for (BodyPhotoTagEntity entity : entities) {
      var dto = bodyPhotoTagsSerializer.convert(entity, language);
      tags.put(
          dto.tag().tagId(),
          dto.tag().name()
      );
    }
    return new BodyPhotoTagsDto( photoId,tags );
  }

  public void addBodyPhotoTags(UUID photoId, List<TagDto> tagsDto) {
    for (TagDto tagDto : tagsDto) {
      saveBodyPhotoTag(photoId, tagDto.tagId());
    }
  }

  public void saveBodyPhotoTag(UUID bodyPhotoId, UUID dictTagId) {

    BodyPhotoEntity bodyPhotoRef =
        entityManager.getReference(BodyPhotoEntity.class, bodyPhotoId);

    DictTagsEntity dictTagRef =
        entityManager.getReference(DictTagsEntity.class, dictTagId);

    BodyPhotoTagEntity entity = BodyPhotoTagEntity.builder()
        .id(UUID.randomUUID())
        .bodyPhoto(bodyPhotoRef)
        .dictTag(dictTagRef)
        .build();

    bodyPhotosTagsRepository.save(entity);
  }

  @Transactional
  public void deleteBodyPhotoTag(UUID photoId, UUID tagId) {
    bodyPhotosTagsRepository.deleteByPhotoIdAndTagId(photoId, tagId);
  }
}
