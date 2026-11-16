package com.zapiszto.controllers.card.repository;

import com.zapiszto.controllers.card.entity.CardEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CardRepository extends JpaRepository<CardEntity, UUID> {
  List<CardEntity> findAllByUserId(Long userId);

  Optional<CardEntity> findByUserId(Long userId);

  @Query(nativeQuery = true, value = """
                                      select c.* from
                                          (
                                          select *,
                                          rank() over (partition by id) as rank
                                          from card
                                          where approved = true
                                          ) as c
                                          where 1=1 
                                          and c.rank >= :from
                                          and c.rank <= :to
                                    """)
  List<CardEntity> findCardsFromTo(@Param("from") int from, @Param("to")  int to);

  @Query(nativeQuery = true, value = """
        WITH last_status AS (
                            SELECT DISTINCT ON (card_id)
                                card_id,
                                dict_card_status_id
                            FROM card_status
                            ORDER BY card_id, datetime DESC
                          )
        SELECT c.*
        FROM card c
        JOIN last_status ls ON ls.card_id = c.id
        WHERE ls.dict_card_status_id = '633a89a2-b0ff-4fe3-9510-ace3096d0922'
        ORDER BY c.id
        OFFSET :from LIMIT (:to - :from + 1)
        """)
  List<CardEntity> findCardsFromToByAdmin(@Param("from") int from, @Param("to")  int to);

}
