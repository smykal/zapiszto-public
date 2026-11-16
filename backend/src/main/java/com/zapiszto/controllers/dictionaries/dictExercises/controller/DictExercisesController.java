package com.zapiszto.controllers.dictionaries.dictExercises.controller;

import com.zapiszto.controllers.account.entity.ERole;
import com.zapiszto.controllers.common.ControllerCommon;
import com.zapiszto.controllers.dictionaries.dictExercises.dto.DictExercisesDto;
import com.zapiszto.controllers.dictionaries.dictExercises.dto.NewDictExerciseDto;
import com.zapiszto.controllers.dictionaries.dictExercises.service.DictExerciseService;
import com.zapiszto.controllers.dictionaries.dictExercises.dto.TranslationsDictExercisesDto;
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
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
@RestController
@RequestMapping("/v1")
@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN') or hasRole('TRAINER')")
public class DictExercisesController implements ControllerCommon {

  @Autowired
  DictExerciseService dictExerciseService;

  @PostMapping("/add_exercise_per_user")
  public ResponseEntity<DictExercisesDto> addExercisePerUser(
      @RequestBody NewDictExerciseDto newDictExerciseDto
  ) {
    var userId = extractUserId();
    DictExercisesDto result = dictExerciseService.addDictExercise(newDictExerciseDto, userId);
    return new ResponseEntity<>(result, HttpStatus.CREATED);
  }

  @PostMapping("/add_exercise_basic")
  public ResponseEntity<String> addExerciseBasic(
      @RequestBody NewDictExerciseDto newDictExerciseDto
  ) {
    var userId = extractUserId();
    var role = extractUserRole();
    dictExerciseService.addDictExercise(newDictExerciseDto);
    return new ResponseEntity<>(HttpStatus.CREATED);
  }

  @GetMapping("/get_exercise_basic")
  public ResponseEntity<List<DictExercisesDto>> getExerciseBasic(
  ) {
    var userId = extractUserId();
    try {
      var result = dictExerciseService.getDictExercises(userId);
      return new ResponseEntity<>(result, HttpStatus.CREATED);
    } catch (NullPointerException e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }

  }

  @GetMapping("/get_exercises_per_user")
  public ResponseEntity<List<DictExercisesDto>> getExercisesPerUser(
  ) {
    var userId = extractUserId();
    try {
      var result = dictExerciseService.getDictExercises(userId);
      return new ResponseEntity<>(result, HttpStatus.CREATED);
    } catch (NullPointerException e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
  }

  @GetMapping("/get_dict_exercise_per_user_details/{id}")
  public ResponseEntity<TranslationsDictExercisesDto> getTranslations(@PathVariable("id") UUID id) {
    var userRole = extractUserRole();
    try {
      var result = dictExerciseService.getDetails(id, userRole);
      return new ResponseEntity<>(result, HttpStatus.ACCEPTED);
    } catch (NullPointerException e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
  }

  @PatchMapping("/update_dict_exercise_name")
  public ResponseEntity<String> updateName(@RequestBody TranslationsDictExercisesDto translationsDictExercisesDto) {
    var userId = extractUserId();
    try {
      dictExerciseService.updateName(translationsDictExercisesDto);
      return new ResponseEntity<>(null, HttpStatus.CREATED);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
  }

  @DeleteMapping("/delete_exercise/{itemToDelete}")
  public ResponseEntity<String> deleteExerciseBasic(
      @PathVariable("itemToDelete") UUID itemToDelete
  ) {
    var userRole = extractUserRole();
    var userId = extractUserId();
    try {
      dictExerciseService.deleteDictExercise(userId, userRole, itemToDelete);
      return new ResponseEntity<>(HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
  }
}
