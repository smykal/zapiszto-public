package com.zapiszto.controllers.execrisesAttachments.controller;

import com.zapiszto.controllers.common.ControllerCommon;
import com.zapiszto.controllers.execrisesAttachments.dto.ExerciseAttachmentDto;
import com.zapiszto.controllers.execrisesAttachments.service.ExercisesAttachmentsService;
import java.util.List;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
@RestController
@RequestMapping("/v1")
@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')  or hasRole('TRAINER')")
public class ExercisesAttachmentsController implements ControllerCommon {

  @Autowired
  ExercisesAttachmentsService exercisesAttachmentsService;

  @GetMapping("/exercises_attachments_for_exercise/{exerciseId}")
  public ResponseEntity<List<ExerciseAttachmentDto>> getExerciseAttachmentsForExercise(
      @RequestParam(name = "clientId", required = false) UUID clientId,
      @PathVariable("exerciseId") UUID exerciseId
  ) {
    var role = extractUserRole();
    var response = exercisesAttachmentsService.getExerciseAttachmentForExercise(exerciseId, clientId, role);
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @GetMapping("/exercises_attachments_for_dict_exercise/{dictExerciseId}")
  public ResponseEntity<List<ExerciseAttachmentDto>> getExerciseAttachmentsForDictExercise(
      @PathVariable("dictExerciseId") UUID dictExerciseId
  ) {
    var userId = extractUserId();
    var role = extractUserRole();
    var response = exercisesAttachmentsService.getExerciseAttachmentForDictExercise(dictExerciseId, userId, role);
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @PostMapping("/exercises_attachments")
  public ResponseEntity<String> addExerciseAttachment(
      @RequestParam("file") MultipartFile file,
      @RequestParam(required = false) UUID exerciseId,
      @RequestParam(required = false) UUID dictExerciseId) {

    var role = extractUserRole();
    exercisesAttachmentsService.addExerciseAttachment(file,exerciseId, dictExerciseId, role);
   return new ResponseEntity<>(HttpStatus.OK);
  }

  @DeleteMapping("/exercise_attachment")
  public ResponseEntity<String> deleteExerciseAttachment(
      @RequestParam(required = false) UUID exerciseId,
      @RequestParam(required = false) UUID dictExerciseId
  ) {
    var role = extractUserRole();
    var userId = extractUserId();
    exercisesAttachmentsService.delete(exerciseId, dictExerciseId, role, userId);
    return new ResponseEntity<>(HttpStatus.OK);
  }
}
