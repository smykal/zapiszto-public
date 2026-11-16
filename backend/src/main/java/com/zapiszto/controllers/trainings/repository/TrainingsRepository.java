package com.zapiszto.controllers.trainings.repository;

import com.zapiszto.controllers.exercises.entity.ExerciseEntity;
import com.zapiszto.controllers.trainings.entity.TrainingEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TrainingsRepository extends JpaRepository<TrainingEntity, Integer> {

  @Query(nativeQuery = true, value = """
      select t.*  from trainings t
      		        left join workbooks w on w.id = t.workbooks_id
      		        where w.user_id = :userId
      		        and w.id = :workbookId
      		        order by t.date desc
      """)
  List<TrainingEntity> getTrainings(
      @Param("userId") Long userId,
      @Param("workbookId") int workbookId
  );

  @Query(nativeQuery = true, value = """
      select t.*
              from workbooks w
            	inner join trainings t on t.workbooks_id = w.id
            	where w.user_id = :userId
            	and t.id = :trainingId
      """)
  TrainingEntity getByUserIdTrainingId(Long userId, int trainingId);
}
