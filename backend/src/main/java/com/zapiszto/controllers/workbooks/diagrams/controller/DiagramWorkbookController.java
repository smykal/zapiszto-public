package com.zapiszto.controllers.workbooks.diagrams.controller;

import com.zapiszto.controllers.common.ControllerCommon;
import com.zapiszto.controllers.workbooks.diagrams.dto.TimeMaxTimeAvgTimeForEachExerciseEachTraining;
import com.zapiszto.controllers.workbooks.diagrams.dto.TrainingFrequencyDto;
import com.zapiszto.controllers.workbooks.diagrams.dto.VolumeMaxVolumeAvgVolumeForEachExerciseEachTraining;
import com.zapiszto.controllers.workbooks.diagrams.dto.VolumeSetsRepsForEachDateInCategoryDto;
import com.zapiszto.controllers.workbooks.diagrams.service.DiagramWorkbookService;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
@RestController
@RequestMapping("/v1")
@PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN') or hasRole('TRAINER') or hasRole('USER')")
@AllArgsConstructor
public class DiagramWorkbookController implements ControllerCommon {

  @Autowired
  DiagramWorkbookService diagramWorkbookService;

  @GetMapping("/get_trainings_frequency/{workbookId}")
  public ResponseEntity<List<TrainingFrequencyDto>> getExerciseStats(
      @PathVariable int workbookId
  ) {
    try {
      var userId = extractUserId();
      var stats = diagramWorkbookService.getTrainingFrequency(userId, workbookId);
      return new ResponseEntity<>(stats, HttpStatus.OK);
    } catch (Exception e) {
      log.error("Error retrieving exercise stats", e);
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @GetMapping("/get_repetitions_sets_volume_for_each_training_and_date/{workbookId}")
  public ResponseEntity<List<VolumeSetsRepsForEachDateInCategoryDto>> getVolumeSetsRepsForEachDateInCategory(
      @PathVariable int workbookId
  ) {
    try {
      var userId = extractUserId();
      var stats = diagramWorkbookService.getVolumeSetsRepsForEachDateInCategory(userId, workbookId);
      return new ResponseEntity<>(stats, HttpStatus.OK);
    } catch (Exception e) {
      log.error("Error retrieving exercise stats", e);
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping("/get_volume_max_volume_avg_volume_for_each_exercise_each_training/{workbookId}")
  public ResponseEntity<List<VolumeMaxVolumeAvgVolumeForEachExerciseEachTraining>> getVolumeMaxVolumeAvgVolumeForEachExerciseEachTraining(
      @PathVariable int workbookId
  ) {
    try {
      var userId = extractUserId();
      var stats = diagramWorkbookService.getVolumeMaxVolumeAvgVolumeForEachExerciseEachTraining(userId, workbookId);
      return new ResponseEntity<>(stats, HttpStatus.OK);
    } catch (Exception e) {
      log.error("Error retrieving exercise stats", e);
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping("/get_time_max_time_avg_time_for_each_exercise_each_training/{workbookId}")
  public ResponseEntity<List<TimeMaxTimeAvgTimeForEachExerciseEachTraining>> getTimeMaxTimeAvgTimeForEachExerciseEachTraining(
      @PathVariable int workbookId
  ) {
    try {
      var userId = extractUserId();
      var stats = diagramWorkbookService.getTimeMaxTimeAvgTimeForEachExerciseEachTraining(userId, workbookId);
      return new ResponseEntity<>(stats, HttpStatus.OK);
    } catch (Exception e) {
      log.error("Error retrieving exercise stats", e);
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}