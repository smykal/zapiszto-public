package com.zapiszto.controllers.program.mesocycle.repository;

import com.zapiszto.controllers.program.mesocycle.entity.MesocycleEntity;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MesocycleRepository extends JpaRepository<MesocycleEntity, UUID> {
  @Query(nativeQuery = true, value = """
      select * from mesocycle m where m.macrocycle_id = :macrocycleId
      """)
  List<MesocycleEntity> getMesocyclesByMacrocycleId(@Param("macrocycleId") UUID macrocycleId);

  @Query(nativeQuery = true, value = """
      select coalesce(max(m.order_id), 0) from mesocycle m where m.macrocycle_id = :macrocycleId
      """)
  Optional<Integer> findMaxOrderIdByMacrocycleId(@Param("macrocycleId") UUID macrocycleId);

  @Query(
      nativeQuery = true, value = """
      select mes.* from programs p
      		left join macrocycle mac on mac.program_id = p.id
      		left join mesocycle mes on mes.macrocycle_id = mac.id
      		where program_id = :programId
      """)
  List<MesocycleEntity> getMesocyclesForProgram(
      @Param("programId") UUID programId
  );
}
