package com.zapiszto.controllers.dictionaries.dictCardStatus.repository;

import com.zapiszto.controllers.dictionaries.dictCardStatus.entity.DictCardStatusEntity;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DictCardStatusRepository extends JpaRepository<DictCardStatusEntity, UUID> {

  @Query(nativeQuery = true, value = """
      select dcs.* from dict_card_status dcs
                   left join card_status cs on dcs.id = cs.dict_card_status_id 
                   left join card c on cs.card_id = c.id
                   where c.user_id = :userId
                   order by cs.datetime  desc
                   limit 1
      """)
  DictCardStatusEntity getActualCardStatus(@Param("userId")Long userId);

  @Query(nativeQuery = true, value = """
      select dcs.* from dict_card_status dcs
                   left join card_status cs on dcs.id = cs.dict_card_status_id 
                   left join card c on cs.card_id = c.id
                   where cs.card_id = :cardId
                   order by cs.datetime  desc
                   limit 1
      """)
  DictCardStatusEntity getActualCardStatusByCardId(@Param("cardId") UUID cardId);

}