package com.zapiszto.controllers.card.card_status.repository;

import com.zapiszto.controllers.card.card_status.entity.CardStatusEntity;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CardStatusRepository extends JpaRepository<CardStatusEntity, UUID> {

  @Query(
      nativeQuery = true, value = """
      select cs.* from card_status cs
                   left join card c on cs.card_id = c.id
                   where c.user_id = :userId
                   order by cs.datetime  desc
                   limit 1
      """)
  CardStatusEntity getReferenceByUserId(@Param("userId") Long userId);


  @Query(
      nativeQuery = true, value = """
      select cs.* from card_status cs
                   where cs.card_id = :cardId
                   order by cs.datetime  desc
                   limit 1
      """)
  CardStatusEntity getByCardId(@Param("cardId") UUID cardId);
}
