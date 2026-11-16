package com.zapiszto.controllers.bodyParams.repository;

import com.zapiszto.controllers.bodyParams.entity.BodyParamsEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BodyParamsRepository extends JpaRepository<BodyParamsEntity, Integer> {

  @Query(nativeQuery = true, value = """
      SELECT  id, 
              dict_body_params_id, 
              value,
              user_id, 
              insert_date, 
              client_id,
              created_by 
      from body_params where user_id = :userId
      """)
  List<BodyParamsEntity> getAllByUserId(
      @Param("userId") Long userId
  );

  @Query(nativeQuery = true, value = """
      SELECT  id, 
              dict_body_params_id, 
              value,
              user_id, 
              insert_date, 
              client_id,
              created_by 
      from body_params where client_id = :clientId
      """)
  List<BodyParamsEntity> getAllByClientId(
      @Param("clientId") UUID clientId
  );

  @Query(nativeQuery = true, value = """
        WITH ranked_rows AS (
          SELECT
            bp.id,
            dbp.id  as dict_body_params_id,
            value ,
            user_id,
            insert_date,
            client_id,
            created_by,
            ROW_NUMBER() OVER (PARTITION BY dict_body_params_id ORDER BY insert_date DESC) AS row_num
          FROM
            public.body_params bp
            left join public.dict_body_params dbp on dbp.id = bp.dict_body_params_id
            where user_id = :userId
        )
        SELECT
          id,
          dict_body_params_id,
          value,
          user_id,
          insert_date,
          client_id,
          created_by
        FROM
          ranked_rows
        where row_num = 1
        """)
  List<BodyParamsEntity> getActualBodyParamsByUserId(
      @Param("userId") Long userId
  );

  @Query(nativeQuery = true, value = """
        WITH ranked_rows AS (
          SELECT
            bp.id,
            dbp.id  as dict_body_params_id,
            value ,
            user_id,
            insert_date,
            client_id,
            created_by,
            ROW_NUMBER() OVER (PARTITION BY dict_body_params_id ORDER BY insert_date DESC) AS row_num
          FROM
            public.body_params bp
            left join public.dict_body_params dbp on dbp.id = bp.dict_body_params_id
            where client_id = :clientId
        )
        SELECT
          id,
          dict_body_params_id,
          value,
          user_id,
          insert_date,
          client_id,
          created_by
        FROM
          ranked_rows
        where row_num = 1
        """)
  List<BodyParamsEntity> getActualBodyParamsByClientId(
      @Param("clientId") UUID clientId
  );

  @Query(nativeQuery = true, value = """
      select bp.value from body_params bp
                  where bp.user_id = :userId
                  and bp.dict_body_params_id = 	( 	SELECT id
      												                      FROM public.dict_body_params
      												                      WHERE "name" @> '{"en": "Height"}'
                  								                )
                  order by insert_date desc
                  limit 1
      """)
  String getLastHeight(
      @Param("userId") Long userId
  );

  @Query(nativeQuery = true, value = """
      select * from body_params bp
      where bp.user_id = :userId
      and bp.dict_body_params_id = ( 	SELECT id
      												                      FROM public.dict_body_params
      												                      WHERE "name" @> '{"en": "Weight"}'
                  								                )
      order by insert_date desc
      """)
  List<BodyParamsEntity> getWeight(@Param("userId") Long userId);

  @Query(nativeQuery = true, value = """
    SELECT EXISTS (
                    SELECT 1
                    FROM body_params bp
                    WHERE bp.user_id = :userId
                      AND bp.id = :id
                  )
    """)
  boolean checkIfBodyParamBelongsToUser(@Param("userId") Long userId,
                                        @Param("id") Integer itemToCheck);

  @Modifying
  @Query(nativeQuery = true, value = """
      delete from body_params bp where bp.user_id = :userId
          AND bp.id = :id
      """)
  void deleteBodyParamByUserIdAndParamId(@Param("userId") Long userId,
                                         @Param("id") Integer itemToDelete);
}
