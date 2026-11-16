package com.zapiszto.controllers.workbooks.diagrams.repository;

import com.zapiszto.controllers.workbooks.entity.WorkbooksEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DiagramWorkbookRepository extends JpaRepository<WorkbooksEntity, Integer> {

  @Query(
      nativeQuery = true, value = """
      select
      	    TO_CHAR(t."date", 'YYYY-MM-DD') as "date"
      	    ,count(t."date")  as trainings_count
      from workbooks w
      left join trainings t on t.workbooks_id = w.id
      where 1=1
            and w.user_id = :userId
            and w.id = :workbookId
      group by t."date"
      """)
  List<Object[]> getTrainingDays(
      @Param("userId") Long userId,
      @Param("workbookId") int workbookId);


  @Query(
      nativeQuery = true, value = """
      WITH weeks AS (
                      SELECT generate_series(
                         DATE_TRUNC('week', ( select w.insert_date from workbooks w where w.user_id = :userId and w.id = :workbookId order by w.insert_date asc limit 1)),
                            DATE_TRUNC('week', now()),
                        INTERVAL '1 week'
                      ) AS week_start
      ),
      aggregated AS (
        SELECT
              DATE_TRUNC('week', t."date") AS week,
              COALESCE(dcpu.name, dcb.name, dcpu2.name, dcb2.name) AS category,
              COUNT(e.id) AS sets,
              SUM(e.quantity) AS repetitions,
              SUM(e.quantity * COALESCE(NULLIF(e.volume, 0), 1)) AS volume
        FROM workbooks w
        LEFT JOIN trainings t ON t.workbooks_id = w.id
        LEFT JOIN exercises e ON e.training_id = t.id
        LEFT JOIN dict_exercises de ON de.id = e.dict_exercise_id
            LEFT JOIN dict_exercises_per_user depu ON depu.id = de.dict_exercises_per_user_id
                LEFT JOIN dict_category dc ON depu.dict_category_id = dc.id
                    LEFT JOIN dict_category_per_user dcpu ON dcpu.id = dc.dict_category_per_user_id
                    LEFT JOIN dict_category_basic dcb ON dcb.id = dc.dict_category_basic_id
            LEFT JOIN dict_exercises_basic deb ON deb.id = de.dict_exercises_basic_id
                LEFT JOIN dict_category dc2 ON deb.dict_category_id = dc2.id
                    LEFT JOIN dict_category_per_user dcpu2 ON dcpu2.id = dc2.dict_category_per_user_id
                    LEFT JOIN dict_category_basic dcb2 ON dcb2.id = dc2.dict_category_basic_id
        WHERE   w.user_id = :userId
        		    and w.id = :workbookId
        		    and e.dict_quantity_type_id = 'b9358d45-fc90-4ee6-88fb-73eda8482c6f'
        GROUP BY week, category
      )
      SELECT
        TO_CHAR(w.week_start, 'YYYY-MM-DD') AS week,
        a.category,
        a.sets,
        a.repetitions,
        a.volume
      FROM weeks w
      LEFT JOIN aggregated a ON a.week = w.week_start
      WHERE a.category IS NOT NULL
        AND a.sets IS NOT NULL
        AND a.repetitions IS NOT NULL
        AND a.volume IS NOT NULL
      ORDER BY week, category
      """)
  List<Object[]> getVolumeSetsRepsForEachDateInCategory(
      @Param("userId") Long userId,
      @Param("workbookId") int workbookId);

  @Query(
      nativeQuery = true, value = """
    with filtered_data as (select
    								t."date" 																	                                                  AS date
    								,COALESCE(depu.name, deb.name) 												                                      AS exercise_name
    								,COALESCE(dcpu.name, dcb.name, dcpu2.name, dcb2.name) 						                          AS category_name
    								,e.volume																	                                                  AS volume
    								,SUM(e.volume * e.quantity) OVER (PARTITION BY t."date", COALESCE(depu.name, deb.name)) /
                      NULLIF(SUM(e.quantity) OVER (PARTITION BY t."date", COALESCE(depu.name, deb.name)), 0)    AS avg
    								,MAX(e.volume) over (partition by t."date", COALESCE(depu.name, deb.name)) 	as max
     FROM workbooks w
     LEFT JOIN trainings t ON t.workbooks_id = w.id
     LEFT JOIN exercises e ON e.training_id = t.id
     LEFT JOIN dict_exercises de ON de.id = e.dict_exercise_id
     LEFT JOIN dict_exercises_per_user depu ON depu.id = de.dict_exercises_per_user_id
     LEFT JOIN dict_category dc ON depu.dict_category_id = dc.id
     LEFT JOIN dict_category_per_user dcpu ON dcpu.id = dc.dict_category_per_user_id
     LEFT JOIN dict_category_basic dcb ON dcb.id = dc.dict_category_basic_id
     LEFT JOIN dict_exercises_basic deb ON deb.id = de.dict_exercises_basic_id
     LEFT JOIN dict_category dc2 ON deb.dict_category_id = dc2.id
     LEFT JOIN dict_category_per_user dcpu2 ON dcpu2.id = dc2.dict_category_per_user_id
     LEFT JOIN dict_category_basic dcb2 ON dcb2.id = dc2.dict_category_basic_id
     left join dict_quantity_type dqt on e.dict_quantity_type_id = dqt.id
     WHERE w.user_id = :userId
     		and w.id = :workbookId
     		and e.volume != 0
     		and e.volume is not null
     		and dqt.dict_quantity_type_basic_id = '042ac157-4ead-4a6b-918b-3f094d2c20a7'
     order by t."date", exercise_name, e.order_number)
      select 	distinct
            			filtered_data.category_name
            			,filtered_data.exercise_name
            			,TO_CHAR(filtered_data."date", 'YYYY-MM-DD') as "date"
            			,COALESCE(CAST(NTH_VALUE(filtered_data.volume, 1) over (partition by filtered_data."date", filtered_data.exercise_name) AS real), 0) as col_01
                 ,COALESCE(CAST(NTH_VALUE(filtered_data.volume, 2) over (partition by filtered_data."date", filtered_data.exercise_name) as real), 0) as col_02
                 ,COALESCE(CAST(NTH_VALUE(filtered_data.volume, 3) over (partition by filtered_data."date", filtered_data.exercise_name) AS real), 0) as col_03
                 ,COALESCE(CAST(NTH_VALUE(filtered_data.volume, 4) over (partition by filtered_data."date", filtered_data.exercise_name) AS real), 0) as col_04
                 ,COALESCE(CAST(NTH_VALUE(filtered_data.volume, 5) over (partition by filtered_data."date", filtered_data.exercise_name) AS real), 0) as col_05
                 ,CAST(filtered_data.avg AS real) as avg
                 ,CAST(filtered_data.max AS real) as max
            			from filtered_data
            			order by TO_CHAR(filtered_data."date", 'YYYY-MM-DD')
    """)
  List<Object[]> getVolumeMaxVolumeAvgVolumeForEachExerciseEachTraining(
      @Param("userId") Long userId,
      @Param("workbookId") int workbookId);

  @Query(
      nativeQuery = true, value = """
      with filtered_data as (select
          								t."date" 																	                                                  AS date
          								,COALESCE(depu.name, deb.name) 												                                      AS exercise_name
          								,COALESCE(dcpu.name, dcb.name, dcpu2.name, dcb2.name) 						                          AS category_name
          								--,e.quantity																	                                                  AS volume
          								,case
          									when dqt.dict_quantity_type_basic_id = '7858a943-ac01-420a-be24-6c70d2a0f3c7' then e.quantity * 60
          									else e.quantity
          								end as volume
          								,case
          									when dqt.dict_quantity_type_basic_id = '7858a943-ac01-420a-be24-6c70d2a0f3c7'
          									then
          									  (SUM(e.quantity) OVER (PARTITION BY t."date", COALESCE(depu.name, deb.name)) /
                            	NULLIF(COUNT(e.quantity) OVER (PARTITION BY t."date", COALESCE(depu.name, deb.name)), 0)) * 60 
                            else
                            	SUM(e.quantity) OVER (PARTITION BY t."date", COALESCE(depu.name, deb.name)) /
                            	NULLIF(COUNT(e.quantity) OVER (PARTITION BY t."date", COALESCE(depu.name, deb.name)), 0)
                            end AS avg
                          ,case
          									when dqt.dict_quantity_type_basic_id = '7858a943-ac01-420a-be24-6c70d2a0f3c7'
          									then
          									  MAX(e.quantity*60) over (partition by t."date", COALESCE(depu.name, deb.name))
          									else
          								    MAX(e.quantity) over (partition by t."date", COALESCE(depu.name, deb.name))
          								  end as max
      					     FROM workbooks w
      					     LEFT JOIN trainings t ON t.workbooks_id = w.id
      					     LEFT JOIN exercises e ON e.training_id = t.id
      					     LEFT JOIN dict_exercises de ON de.id = e.dict_exercise_id
      					     LEFT JOIN dict_exercises_per_user depu ON depu.id = de.dict_exercises_per_user_id
      					     LEFT JOIN dict_category dc ON depu.dict_category_id = dc.id
      					     LEFT JOIN dict_category_per_user dcpu ON dcpu.id = dc.dict_category_per_user_id
      					     LEFT JOIN dict_category_basic dcb ON dcb.id = dc.dict_category_basic_id
      					     LEFT JOIN dict_exercises_basic deb ON deb.id = de.dict_exercises_basic_id
      					     LEFT JOIN dict_category dc2 ON deb.dict_category_id = dc2.id
      					     LEFT JOIN dict_category_per_user dcpu2 ON dcpu2.id = dc2.dict_category_per_user_id
      					     LEFT JOIN dict_category_basic dcb2 ON dcb2.id = dc2.dict_category_basic_id
      					     left join dict_quantity_type dqt on e.dict_quantity_type_id = dqt.id
      					     WHERE w.user_id = :userId
      					     		and w.id = :workbookId
      					     		and (e.volume = 0 or e.volume is null)
      					     		and dqt.dict_quantity_type_basic_id != '042ac157-4ead-4a6b-918b-3f094d2c20a7'
      					     order by t."date", exercise_name, e.order_number)
            select 	distinct
                  			filtered_data.category_name
                  			,filtered_data.exercise_name
                  			,TO_CHAR(filtered_data."date", 'YYYY-MM-DD') as "date"
                  			,COALESCE(CAST(NTH_VALUE(filtered_data.volume, 1) over (partition by filtered_data."date", filtered_data.exercise_name) AS real), 0) as col_01
                       ,COALESCE(CAST(NTH_VALUE(filtered_data.volume, 2) over (partition by filtered_data."date", filtered_data.exercise_name) as real), 0) as col_02
                       ,COALESCE(CAST(NTH_VALUE(filtered_data.volume, 3) over (partition by filtered_data."date", filtered_data.exercise_name) AS real), 0) as col_03
                       ,COALESCE(CAST(NTH_VALUE(filtered_data.volume, 4) over (partition by filtered_data."date", filtered_data.exercise_name) AS real), 0) as col_04
                       ,COALESCE(CAST(NTH_VALUE(filtered_data.volume, 5) over (partition by filtered_data."date", filtered_data.exercise_name) AS real), 0) as col_05
                       ,CAST(filtered_data.avg AS real) as avg
                       ,CAST(filtered_data.max AS real) as max
                  			from filtered_data
                  			order by TO_CHAR(filtered_data."date", 'YYYY-MM-DD')
    """)
  List<Object[]> getTimeMaxTimeAvgTimeForEachExerciseEachTraining(
      @Param("userId") Long userId,
      @Param("workbookId") int workbookId);

}
