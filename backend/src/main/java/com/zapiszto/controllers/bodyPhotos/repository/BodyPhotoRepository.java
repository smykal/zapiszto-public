package com.zapiszto.controllers.bodyPhotos.repository;

import com.zapiszto.controllers.bodyPhotos.entity.BodyPhotoEntity;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository


public interface BodyPhotoRepository extends JpaRepository<BodyPhotoEntity, UUID> {

  @Query(
      nativeQuery = true, value = """
      select * from body_photos bp where user_id =:userId order by order_number desc
      """)
  List<BodyPhotoEntity> getBodyPhotosByUserIdOrderByOrderNumberDesc(@Param("userId") Long userId);

  @Query(
      nativeQuery = true, value = """
      select COALESCE(max(e.order_number), 0) + 1 from body_photos e where user_id =:userId
      """)
  Integer getOrderNumber(@Param("userId") Long userId);

  @Query(
      nativeQuery = true, value = """
      select * from body_photos
      where user_id = :userId
      and created_by = user_id
      """)
  List<BodyPhotoEntity> getBodyPhotosForUser(@Param("userId") Long userId);

  @Query(
      nativeQuery = true, value = """
      select *
            from (
                select bp.*
                from body_photos bp
                left join clients c
                    on c.id = bp.client_id
                    or c.user_id = bp.user_id
                inner join body_photos_share bps
                		on bps.body_photo_id = bp.id
                		and bps.user_id = :createdBy
      
                union
      
                select bp.*
                from body_photos bp
                left join clients c
                    on bp.client_id = c.id
                where c.id = :clientId
                  and created_by = :createdBy
            ) t
            order by order_number desc;
      """)
  List<BodyPhotoEntity>  getBodyPhotosForTrainer( @Param("clientId") UUID clientId,
                                                  @Param("createdBy") Long createdBy);

  @Transactional
  @Modifying
  @Query("DELETE FROM BodyPhotoEntity c WHERE c.id = :photoId")
  void deleteByPhotoId(@Param("photoId") UUID photoId);
}
