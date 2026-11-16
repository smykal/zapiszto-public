package com.zapiszto.controllers.bodyPhotos.bodyPhotosTags.repository;

import com.zapiszto.controllers.bodyPhotos.bodyPhotosTags.entity.BodyPhotoTagEntity;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BodyPhotosTagsRepository extends JpaRepository<BodyPhotoTagEntity, UUID> {

  @Query(nativeQuery = true, value = """
  select * from body_photos_tags
  where body_photo_id = :photoId
  """)
  List<BodyPhotoTagEntity> getAllTagsByPhotoId(UUID photoId);

  @Transactional
  @Modifying
  @Query(nativeQuery = true, value = """
      delete from body_photos_tags
      where body_photo_id = :photoId
      and dict_tags_id = :tagId
      """)
  void deleteByPhotoIdAndTagId(UUID photoId, UUID tagId);
}
