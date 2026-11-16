package com.zapiszto.controllers.card.card_photos.repository;

import com.zapiszto.controllers.card.card_photos.entity.CardPhotoEntity;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CardPhotoRepository extends JpaRepository<CardPhotoEntity, UUID> {


  List<CardPhotoEntity> findAllByCardIdOrderByOrderNumberAsc(UUID cardId);

  @Query(
      nativeQuery = true, value = """
      select COALESCE(max(e.order_number), 0) + 1 from card_photos e where card_id =:cardId
      """)
  Integer getOrderNumber(@Param("cardId") UUID cardId);


  @Query(
      nativeQuery = true, value = """
      select * from card_photos where card_id = :cardId order by order_number asc
      """)
  List<CardPhotoEntity> getPhotoPath(@Param("cardId") UUID cardId);

  @Transactional
  @Modifying
  @Query("DELETE FROM CardPhotoEntity c WHERE c.photoName = :photoName")
  void deleteByPhotoUrl(@Param("photoName") String photoName);
}
