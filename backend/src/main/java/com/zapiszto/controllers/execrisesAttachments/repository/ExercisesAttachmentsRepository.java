package com.zapiszto.controllers.execrisesAttachments.repository;

import com.zapiszto.controllers.execrisesAttachments.dto.ExerciseAttachmentDto;
import com.zapiszto.controllers.execrisesAttachments.entity.ExerciseAttachmentEntity;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ExercisesAttachmentsRepository extends JpaRepository<ExerciseAttachmentEntity, UUID> {
  @Query(nativeQuery = true, value = """
      select ea.* from exercises_attachments ea
                left join exercises e on ea.exercise_id = e.id
                left join trainings t on e.training_id  = t.id
                left join workbooks w on t.workbooks_id = w.id
                left join clients c on w.user_id = c.user_id
                where 1=1
                and ea.exercise_id = :exerciseId
                and c.id = :clientId
      """)
  List<ExerciseAttachmentEntity> getExerciseAttachmentsForTrainer(
      @Param("exerciseId") UUID exerciseId,
      @Param("clientId") UUID clientId);

  @Query(nativeQuery = true, value = """
      select ea.* from exercises_attachments ea
      where 1=1
      and ea.exercise_id = :exerciseId
      """)
  List<ExerciseAttachmentEntity> getExerciseAttachmentsForUser(@Param("exerciseId") UUID exerciseId);

  @Query(nativeQuery = true, value = """
      select ea.* 	from exercises_attachments ea
            						inner join dict_exercises de 			on de.id = ea.dict_exercises_id and de.id = :dictExerciseId
            						inner join dict_exercises_per_user depu	on de.dict_exercises_per_user_id = depu.id
            							and (depu.user_id in (select trainer_id from clients c where c.user_id = :userId) or depu.user_id = :userId)
            						--left join dict_exercises_basic deb on de.dict_exercises_basic_id = deb.id
      """)
  List<ExerciseAttachmentEntity> getExerciseAttachmentsDictExerciseForTrainer(@Param("dictExerciseId") UUID dictExerciseId,
                                                    @Param("userId") Long userId);

  @Query(nativeQuery = true, value = """
       select ea.* 	from exercises_attachments ea
            						inner join dict_exercises de 			on de.id = ea.dict_exercises_id and de.id = :dictExerciseId
            						inner join dict_exercises_per_user depu	on de.dict_exercises_per_user_id = depu.id
            							and (depu.user_id in (select trainer_id from clients c where c.user_id = :userId) or depu.user_id = :userId)
            						left join dict_exercises_basic deb on de.dict_exercises_basic_id = deb.id
      """)
  List<ExerciseAttachmentEntity> getExerciseAttachmentsDictExerciseForUser(@Param("dictExerciseId") UUID dictExerciseId,
                                                    @Param("userId") Long userId);


  @Query(nativeQuery = true, value = """
      SELECT EXISTS ( SELECT 1
          			FROM exercises_attachments ea
          			INNER JOIN dict_exercises de ON ea.dict_exercises_id = de.id
          			INNER JOIN dict_exercises_per_user depu  ON de.dict_exercises_per_user_id = depu.id
      				  WHERE ea.dict_exercises_id = :dictExerciseId
          			) AS has_attachment;
  """)
  Boolean checkIfDictExerciseHasAttachment(@Param("dictExerciseId") UUID dictExerciseId);

  @Query(nativeQuery = true, value= """
      select distinct ea.dict_exercises_id from exercises_attachments ea
                  			inner join dict_exercises de on ea.dict_exercises_id = de.id
                  			left join dict_exercises_basic deb
      									on de.dict_exercises_basic_id = de.id
                  			left join dict_exercises_per_user depu
                  						on de.dict_exercises_per_user_id = depu.id
                  						and depu.user_id = :userId
      """)
  Set<UUID> getDictExercisesWithAttachments(@Param("userId") Long userId);

  @Modifying
  @Query(nativeQuery = true, value = """
      DELETE FROM exercises_attachments ea
      USING exercises e
      JOIN trainings t       ON e.training_id = t.id
      JOIN workbooks w       ON t.workbooks_id = w.id
      WHERE ea.exercise_id = e.id
        AND e.id = :exerciseId
        AND w.user_id = :userId;
      """)
  void deleteByExerciseId(UUID exerciseId, Long userId);

  @Modifying
  @Query(nativeQuery = true, value = """
      DELETE FROM exercises_attachments ea
      using dict_exercises de
      join dict_exercises_per_user depu on de.dict_exercises_per_user_id = depu.id
      where ea.dict_exercises_id = de.id
      and de.id = :dictExerciseId
      and depu.user_id = :userId
      """)
  void deleteByDictExerciseId(UUID dictExerciseId, Long userId);
}
