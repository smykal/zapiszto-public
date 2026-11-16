package com.zapiszto.controllers.clientBodyTest.repository;

import com.zapiszto.controllers.clientBodyTest.entity.ClientBodyTestsEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface ClientBodyTestsRepository extends JpaRepository<ClientBodyTestsEntity, UUID> {

  List<ClientBodyTestsEntity> getAllByClientId(UUID clientId);

  @Modifying
  @Transactional
  @Query(nativeQuery = true, value = """
      delete from client_body_tests cbt
      where cbt.id = :itemToDelete
      """)
  void deleteClientBodyTestByUserIdAndParamId(
      @Param("itemToDelete")UUID itemToDelete);


  @Query(nativeQuery = true, value = """
    SELECT EXISTS (
                    select 1  from client_body_tests cbt
                              left join clients c	on cbt.client_id = c.id
                              where c.trainer_id = :trainerId
                                    and cbt.id = :itemToCheck
                  )
    """)
  boolean checkIfClientBodyTestBelongsToUser(
      @Param("trainerId") Long userId,
      @Param("itemToCheck")UUID itemToCheck);
}
