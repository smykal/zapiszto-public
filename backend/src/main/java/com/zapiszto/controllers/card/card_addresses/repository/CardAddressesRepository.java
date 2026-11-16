package com.zapiszto.controllers.card.card_addresses.repository;

import com.zapiszto.controllers.card.card_addresses.entity.CardAddressEntity;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CardAddressesRepository extends JpaRepository<CardAddressEntity, UUID> {
  List<CardAddressEntity> findAllByCardIdUuid(UUID cardId);


  @Transactional
  @Modifying
  @Query(nativeQuery = true, value = """
      DELETE FROM card_addresses WHERE id = :addressId
      """)
  void deleteAddress(@Param("addressId") UUID addressId);
}
