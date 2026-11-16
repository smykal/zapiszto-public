package com.zapiszto.controllers.execrisesAttachments.entity;

import com.zapiszto.controllers.dictionaries.dictExercises.entity.DictExercisesEntity;
import com.zapiszto.controllers.exercises.entity.ExerciseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "exercises_attachments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ExerciseAttachmentEntity {

  @Id
  @GeneratedValue
  @Column(name = "id", nullable = false)
  UUID id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "exercise_id", foreignKey = @ForeignKey(name = "fk_ex_attach_exercise"))
  ExerciseEntity exercise;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "dict_exercises_id", foreignKey = @ForeignKey(name = "fk_ex_attach_dict_exercise"))
  DictExercisesEntity dictExercise;

  @Column(name = "name", nullable = false, length = 255)
  String name;

  @Column(name = "extension", nullable = false, length = 20)
  String extension;

  @Column(name = "bytes", nullable = false)
  Long bytes;

  @Column(name = "folder", nullable = false, length = 255)
  String folder;

  @Column(name = "create_date", nullable = false)
  LocalDateTime createDate;
}

