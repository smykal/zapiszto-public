package com.zapiszto.controllers.exercises.repository;

import com.zapiszto.controllers.exercises.entity.ExerciseEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ExerciseTrainingRepository extends JpaRepository<ExerciseEntity, UUID> {

  List<ExerciseEntity> getAllByTrainingId(@Param("trainingId") Integer trainingId);

  @Query(
      nativeQuery = true, value = """
      select e.*  from exercises e
                left join trainings t on t.id = e.training_id
                left join workbooks w on w.id = t.workbooks_id
                          where w.user_id = :userId
                          and e.training_id = :trainingId
                order by e.order_number asc
      """)
  List<ExerciseEntity> getExercisesByTrainingId(
      @Param("userId") Long userId,
      @Param("trainingId") int trainingId
  );

  @Query(
      nativeQuery = true, value = """
      select e.*
      from exercises e
      where e.id = :exerciseId
      """)
  ExerciseEntity getExercisesByExerciseId(
      @Param("exerciseId") UUID exerciseId
  );


  @Query(
      nativeQuery = true, value = """
      select e.*
        from workbooks w
      		inner join trainings t on t.workbooks_id = w.id
      		inner join exercises e on e.training_id = t.id
      		where w.user_id = :userId
      		and e.training_id = :trainingId
      		and e.id = :exerciseId
      """)
  ExerciseEntity getByUserIdTrainingIdExerciseId(
      @Param("userId") Long userId,
      @Param("trainingId") int trainingId,
      @Param("exerciseId") UUID exerciseId
  );

  @Query(
      nativeQuery = true, value = """
      select case
      	when max(e.order_number) is null then 1
      	else max(e.order_number) + 1
      end
        from workbooks w
      		inner join trainings t on t.workbooks_id = w.id
      		inner join exercises e on e.training_id = t.id
      		where w.user_id = :userId
      		and e.training_id = :trainingId
      """)
  Integer getOrderNumber(
      @Param("userId") Long userId,
      @Param("trainingId") int trainingId
  );

  List<ExerciseEntity> findByTrainingIdOrderByOrderNumber(int trainingId);


  @Query(
      nativeQuery = true, value = """
      select
          e.*
      from exercises e
      left join trainings t on e.training_id = t.id
      left join workbooks w on t.workbooks_id = w.id
      where
          w.user_id = :userId
          and e.dict_exercise_id = :dictExerciseId
          and t."date" = (
              select max(t2."date")
              from exercises e2
              join trainings t2 on e2.training_id = t2.id
              join workbooks w2 on t2.workbooks_id = w2.id
              where
                  w2.user_id = :userId
                  and e2.dict_exercise_id = :dictExerciseId
          )
      order by e.order_number desc
            fetch first 1 row only
      """)
  ExerciseEntity getLastExerciseTrainingData(
      @Param("userId") Long userId,
      @Param("dictExerciseId") UUID dictExerciseId
  );
}
