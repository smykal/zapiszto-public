package com.zapiszto.controllers.clients.repository;

import com.zapiszto.controllers.clients.entity.ClientEntity;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface ClientsRepository extends JpaRepository<ClientEntity, UUID> {

  List<ClientEntity> getAllByTrainerId(long trainerId);

  @Query(
      nativeQuery = true, value = """
      SELECT * from clients c
          where c.id = :id
      """)
  ClientEntity getByClientId(@Param("id") UUID id);

  @Query(
      nativeQuery = true, value = """
      SELECT * from clients c
            where user_id = :userId
            limit 1
      """)
  Optional<ClientEntity> getByUserId(@Param("userId") Long userId);

  @Modifying
  @Transactional
  @Query(nativeQuery = true, value = """
      DELETE FROM public.clients
      WHERE id=:clientId
      """)
  void deleteByClientId(@Param("clientId") UUID clientId);

  @Query(nativeQuery = true, value = """
      SELECT NOT EXISTS (
        SELECT 1
        FROM clients c
        RIGHT JOIN programs_details p ON p.assigned_client = c.id
        WHERE c.id = :clientId
      ) AS result;
      """)
  boolean isDeletable(@Param("clientId") UUID clientId);


  @Query(nativeQuery = true, value = """
  SELECT * FROM clients c where user_id in :userIds
  """)
  List<ClientEntity> getClientsByUserId(@Param("userIds") List<Long> userIds);
}
