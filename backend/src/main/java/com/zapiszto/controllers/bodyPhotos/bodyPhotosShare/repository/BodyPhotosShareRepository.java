package com.zapiszto.controllers.bodyPhotos.bodyPhotosShare.repository;

import com.zapiszto.controllers.bodyPhotos.bodyPhotosShare.entity.BodyPhotosShareEntity;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BodyPhotosShareRepository extends JpaRepository<BodyPhotosShareEntity, UUID> {


  @Query(nativeQuery = true, value = """
      select * from body_photos_share bps
      where bps.body_photo_id = :bodyPhotoId
      """)
  Optional<List<BodyPhotosShareEntity>> getAllByBodyPhotoId(@Param("bodyPhotoId") UUID bodyPhotoId);

  @Transactional
  @Modifying
  @Query(nativeQuery = true, value = """
      delete from body_photos_share
      where id = :bodyPhotoShareId
      and user_id = :userId
      """)
  void deleteByPhotoIdAndUserId(
      @Param("bodyPhotoShareId")UUID bodyPhotoShareId,
      @Param("userId")Long userId);
}
