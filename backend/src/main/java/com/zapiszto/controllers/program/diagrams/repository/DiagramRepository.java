package com.zapiszto.controllers.program.diagrams.repository;

import com.zapiszto.controllers.program.mesocycle.entity.MesocycleEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DiagramRepository extends JpaRepository<MesocycleEntity, UUID> {

  @Query(
      nativeQuery = true, value = """
      SELECT 	ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS orderId,
              category ->> :language                      as category,
              SUM(sets * quantity) AS repetitions,
              SUM(sets) AS sets
              FROM (select  m.order_id                         	as orderId,
                      	    coalesce(dcb."name", dcpu."name") 	AS category,
                     		    sum(e.sets * e.quantity)            as repetitions,
                     		    sum(e.sets)                        	as sets,
                     		    e.quantity                          as quantity
      	        from exercises e
      	        left join sessions s on e.session_id = s.id
      	        left join microcycle m on s.microcycle_id = m.id
      	        left join dict_exercises de ON e.dict_exercise_id = de.id
      	        left join dict_exercises_basic deb on de.dict_exercises_basic_id = deb.id
      	        left join dict_exercises_per_user depu on de.dict_exercises_per_user_id = depu.id
      	        left join dict_category dc on coalesce(deb.dict_category_id, depu.dict_category_id) = dc.id
      	        left join dict_category_basic dcb on dc.dict_category_basic_id = dcb.id
      	        left join dict_category_per_user dcpu on dc.dict_category_per_user_id = dcpu.id
      	        where m.mesocycle_id = :mesocycleId
      			  group by m.id, coalesce(dcb.name, dcpu.name), quantity
              	) as subquery
              GROUP BY orderId, category
              ORDER BY orderId, category;
      """)
  List<Object[]> getExerciseStatsByMesocycleId(
      @Param("mesocycleId") UUID mesocycleId,
      @Param("language") String language
  );
}
