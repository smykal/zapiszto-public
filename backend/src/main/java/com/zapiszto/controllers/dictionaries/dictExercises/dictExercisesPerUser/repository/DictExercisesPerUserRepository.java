package com.zapiszto.controllers.dictionaries.dictExercises.dictExercisesPerUser.repository;

import com.zapiszto.controllers.dictionaries.dictExercises.dictExercisesPerUser.entity.DictExercisesPerUserEntity;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DictExercisesPerUserRepository extends JpaRepository<DictExercisesPerUserEntity, UUID> {

}
