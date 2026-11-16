package com.zapiszto.controllers.bodyPhotos.bodyPhotosShare.service;

import com.zapiszto.controllers.account.entity.User;
import com.zapiszto.controllers.bodyPhotos.bodyPhotosShare.dto.BodyPhotoShareDto;
import com.zapiszto.controllers.bodyPhotos.bodyPhotosShare.entity.BodyPhotosShareEntity;
import com.zapiszto.controllers.bodyPhotos.bodyPhotosShare.repository.BodyPhotosShareRepository;
import com.zapiszto.controllers.bodyPhotos.bodyPhotosShare.serializer.BodyPhotosShareSerializer;
import com.zapiszto.controllers.bodyPhotos.entity.BodyPhotoEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BodyPhotosShareService {

  @Autowired
  BodyPhotosShareRepository bodyPhotosShareRepository;

  @Autowired
  BodyPhotosShareSerializer bodyPhotosShareSerializer;

  @PersistenceContext
  EntityManager entityManager;

  public List<BodyPhotoShareDto> getBodyPhotoShared(UUID bodyPhotoId) {

    return bodyPhotosShareRepository
        .getAllByBodyPhotoId(bodyPhotoId)
        .orElse(List.of())
        .stream()
        .map(bodyPhotosShareSerializer::convert)
        .toList();
  }

  @Transactional
  public void addBodyPhotoShares(UUID bodyPhotoId, List<Long> shareToUsers) {

    for (Long shareToUser: shareToUsers) {
      var entity = BodyPhotosShareEntity.builder()
          .id(UUID.randomUUID())
          .bodyPhotoEntity(entityManager.getReference(BodyPhotoEntity.class, bodyPhotoId))
          .user(entityManager.getReference(User.class, shareToUser))
          .build();
      bodyPhotosShareRepository.save(entity);
    }
  }

  @Transactional
  public void deleteBodyPhotoShare(UUID photoId, Long bodyPhotoShareId) {
    bodyPhotosShareRepository.deleteByPhotoIdAndUserId(photoId, bodyPhotoShareId);
  }
}
