package com.zapiszto.controllers.exercises.controller;

import com.zapiszto.controllers.common.ControllerCommon;
import com.zapiszto.controllers.exercises.dto.ExerciseTrainingDto;
import com.zapiszto.controllers.exercises.dto.LastExerciseTrainingDataDto;
import com.zapiszto.controllers.exercises.dto.NewExerciseTrainingDto;
import com.zapiszto.controllers.exercises.serializer.ExerciseSerializer;
import com.zapiszto.controllers.exercises.service.ExercisesTrainingService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.util.List;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
@Validated
@RestController
@RequestMapping("/v1")
@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')  or hasRole('TRAINER')")
public class ExercisesTrainingController implements ControllerCommon {

  @Autowired
  ExercisesTrainingService exercisesTrainingService;

  @PostMapping("/add_exercise")
  public ResponseEntity<String> addExercise(
      @RequestBody NewExerciseTrainingDto newExerciseTrainingDto,
      @RequestParam(required = false, defaultValue = "1")
      @Min(1)
      @Max(5)
      int number
      ) {
    var userId = extractUserId();
    exercisesTrainingService.addExercise(newExerciseTrainingDto, userId, number);
    return new ResponseEntity<>(HttpStatus.CREATED);
  }

  @PostMapping("/copy_exercise_training/{trainingId}/{exerciseId}")
  public ResponseEntity<UUID> copyExercise(
      @PathVariable("trainingId") int trainingId,
      @PathVariable("exerciseId") UUID exerciseId
  ) {
    var userId = extractUserId();
    var response = exercisesTrainingService.copyExercise(exerciseId, trainingId, userId);
    return new ResponseEntity<>(response, HttpStatus.CREATED);
  }

  @GetMapping("/get_exercise/training/{trainingId}")
  public ResponseEntity<List<ExerciseTrainingDto>> getExercises(
      @PathVariable("trainingId") int trainingId
  ) {
    var userId = extractUserId();
    try {
      List<ExerciseTrainingDto> result = exercisesTrainingService.getExercises(trainingId, userId);
      return new ResponseEntity<>(result, HttpStatus.OK);
    } catch (NullPointerException e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
  }

  @GetMapping("/get_exercise/{exerciseId}")
  public ResponseEntity<ExerciseTrainingDto> getExercises(
      @PathVariable("exerciseId") UUID exerciseId
  ) {
    var userId = extractUserId();
    try {
      ExerciseTrainingDto result = exercisesTrainingService.getExercise(exerciseId, userId);
      return new ResponseEntity<>(result, HttpStatus.OK);
    } catch (NullPointerException e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
  }

  @GetMapping("/get_exercise/training/{trainingId}/{userId}")
  public ResponseEntity<List<ExerciseTrainingDto>> getExercises(
      @PathVariable("trainingId") int trainingId,
      @PathVariable("userId") Long userId
  ) {
    var requestor = extractUserId();
    try {
      List<ExerciseTrainingDto> result = exercisesTrainingService.getExercises(trainingId, userId);
      return new ResponseEntity<>(result, HttpStatus.OK);
    } catch (NullPointerException e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
  }

  @GetMapping("/get_exercise_data/{exerciseId}")
  public ResponseEntity<LastExerciseTrainingDataDto> getLastExerciseTrainingData(
      @PathVariable("exerciseId") UUID exerciseId
  ) {
    var userId = extractUserId();
    try {
      LastExerciseTrainingDataDto result = exercisesTrainingService.getLastData(userId, exerciseId);
      return new ResponseEntity<>(result, HttpStatus.OK);
    } catch (NullPointerException e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
  }

  @PatchMapping("/update_exercise_order_number_up/training/{trainingId}/{exerciseId}")
  public ResponseEntity<List<ExerciseTrainingDto>> updateUp(
      @PathVariable Integer trainingId,
      @PathVariable UUID exerciseId
  ) {
    var userId = extractUserId();
    var exerciseTrainingDtoList = exercisesTrainingService.updateExerciseOrderNumberUp(trainingId, exerciseId, userId);
    return new ResponseEntity<>(exerciseTrainingDtoList, HttpStatus.OK);
  }

  @PatchMapping("/update_exercise_order_number_down/training/{trainingId}/{exerciseId}")
  public ResponseEntity<List<ExerciseTrainingDto>> updateDown(
      @PathVariable Integer trainingId,
      @PathVariable UUID exerciseId
  ) {
    var userId = extractUserId();
    var exerciseTrainingDtoList = exercisesTrainingService.updateExerciseOrderNumberDown(trainingId, exerciseId, userId);
    return new ResponseEntity<>(exerciseTrainingDtoList, HttpStatus.OK);
  }

  @PatchMapping("/update_training_exercise/training/{trainingId}/{exerciseId}")
  public ResponseEntity<String> updateExerciseNotes(
      @PathVariable Integer trainingId,
      @PathVariable UUID exerciseId,
      @RequestBody NewExerciseTrainingDto updatedExerciseTrainingDto
  ) {
    var userId = extractUserId();
    exercisesTrainingService.updateTrainingExercise(exerciseId,trainingId, updatedExerciseTrainingDto, userId);
    return new ResponseEntity<>(HttpStatus.OK);
  }

  @DeleteMapping("/delete_exercise_training/{trainingId}/{exerciseId}")
  public ResponseEntity<String> deleteExercise(
      @PathVariable("exerciseId") UUID exerciseId,
      @PathVariable("trainingId") int trainingId
  ) {
    var userId = extractUserId();
    try {
      exercisesTrainingService.deleteExercise(userId, trainingId, exerciseId);
      return new ResponseEntity<>(HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
    }
  }
}
