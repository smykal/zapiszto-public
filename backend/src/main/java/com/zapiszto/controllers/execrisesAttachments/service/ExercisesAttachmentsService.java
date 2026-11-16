package com.zapiszto.controllers.execrisesAttachments.service;

import com.zapiszto.controllers.account.entity.ERole;
import com.zapiszto.controllers.common.AwsCommon;
import com.zapiszto.controllers.dictionaries.dictExercises.entity.DictExercisesEntity;
import com.zapiszto.controllers.execrisesAttachments.dto.ExerciseAttachmentDto;
import com.zapiszto.controllers.execrisesAttachments.entity.ExerciseAttachmentEntity;
import com.zapiszto.controllers.execrisesAttachments.repository.ExercisesAttachmentsRepository;
import com.zapiszto.controllers.execrisesAttachments.serializer.ExercisesAttachmentsSerializer;
import com.zapiszto.controllers.exercises.entity.ExerciseEntity;
import com.zapiszto.controllers.exercises.repository.ExerciseTrainingRepository;
import com.zapiszto.utilities.aws.AwsS3Service;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ExercisesAttachmentsService implements AwsCommon {

  @Autowired
  ExercisesAttachmentsRepository exercisesAttachmentsRepository;

  @Autowired
  ExercisesAttachmentsSerializer exercisesAttachmentsSerializer;

  @Autowired
  ExerciseTrainingRepository exerciseTrainingRepository;

  @Autowired
  AwsS3Service awsS3Service;

  @PersistenceContext
  EntityManager entityManager;

  public List<ExerciseAttachmentDto> getExerciseAttachmentForExercise(UUID exerciseId, UUID clientId, ERole role) {
    List<ExerciseAttachmentEntity> entities;
    if (ERole.ROLE_TRAINER.equals(role) && clientId != null) {
      entities = exercisesAttachmentsRepository.getExerciseAttachmentsForTrainer(exerciseId, clientId);
    } else {
      entities = exercisesAttachmentsRepository.getExerciseAttachmentsForUser(exerciseId);
    }
    return exercisesAttachmentsSerializer.convert(entities);
  }

  public List<ExerciseAttachmentDto> getExerciseAttachmentForDictExercise(UUID dictExerciseId, Long userId, ERole role) {
    List<ExerciseAttachmentEntity> entities;
    if (ERole.ROLE_TRAINER.equals(role)) {
      entities = exercisesAttachmentsRepository.getExerciseAttachmentsDictExerciseForTrainer(dictExerciseId, userId);
    } else {
      entities = exercisesAttachmentsRepository.getExerciseAttachmentsDictExerciseForUser(dictExerciseId, userId);
    }
    return exercisesAttachmentsSerializer.convert(entities);
  }

  @Transactional
  public void addExerciseAttachment(MultipartFile file, UUID exerciseId, UUID dictExerciseId, ERole role) {
    var exercise = exerciseId != null ? entityManager.getReference(ExerciseEntity.class, exerciseId): null;
    var dictExercise = dictExerciseId != null ? entityManager.getReference(DictExercisesEntity.class, dictExerciseId) : null;

    if (ERole.ROLE_USER.equals(role)) {
      var aws = awsS3Service.uploadFileRaw(file, BUCKET, FOLDER_EXERCISES_ATTACHMENT_EXERCISE);
      var entity = ExerciseAttachmentEntity.builder()
          .exercise(exercise)
          .dictExercise(dictExercise)
          .name(aws.fileName())
          .extension(getExtension(aws.fileName()))
          .bytes(file.getSize())
          .createDate(LocalDateTime.now())
          .folder(aws.folderName())
          .build();
      exercisesAttachmentsRepository.save(entity);

      assert exercise != null;
      exercise.setHasAttachment(true);

    } else {
      var aws = awsS3Service.uploadFileRaw(file, BUCKET, FOLDER_EXERCISES_ATTACHMENT_DICT_EXERCISE_PER_USER);
      var entity = ExerciseAttachmentEntity.builder()
          .exercise(exercise)
          .dictExercise(dictExercise)
          .name(aws.fileName())
          .extension(getExtension(aws.fileName()))
          .bytes(file.getSize())
          .createDate(LocalDateTime.now())
          .folder(aws.folderName())
          .build();
      exercisesAttachmentsRepository.save(entity);
    }
  }

  @Modifying
  @Transactional
  public void delete(UUID exerciseId, UUID dictExerciseId, ERole role, Long userId) {
    if (ERole.ROLE_USER.equals(role)) {
      exercisesAttachmentsRepository.deleteByExerciseId(exerciseId, userId);
    }
    else {
      exercisesAttachmentsRepository.deleteByDictExerciseId(dictExerciseId, userId);
    }
  }
}
