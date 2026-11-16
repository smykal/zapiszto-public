package com.zapiszto.controllers.dictionaries.dictBodyTest.controller;

import com.zapiszto.controllers.account.entity.ERole;
import com.zapiszto.controllers.dictionaries.dictBodyTest.dto.DictBodyTestDto;
import com.zapiszto.controllers.dictionaries.dictBodyTest.dto.NewDictBodyTestDto;
import com.zapiszto.controllers.dictionaries.dictBodyTest.dto.TranslationsDictBodyTestDto;
import com.zapiszto.controllers.dictionaries.dictBodyTest.service.DictBodyTestService;
import com.zapiszto.controllers.common.ControllerCommon;
import com.zapiszto.controllers.dictionaries.dictQuantityType.dto.TranslationsDictQuantityTypeDto;
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
@PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN') or hasRole('TRAINER')")
public class DictBodyTestController implements ControllerCommon {

  @Autowired
  DictBodyTestService dictBodyTestService;

  @PostMapping("/add_body_test")
  public ResponseEntity<DictBodyTestDto> addBodyTestPerUser(
      @RequestBody NewDictBodyTestDto newDictBodyTestDto
  ) {
    var userId = extractUserId();
    var userRole = extractUserRole();
    switch (userRole) {
      case ROLE_USER, ROLE_TRAINER -> {
        DictBodyTestDto result = dictBodyTestService.addDictBodyTest(newDictBodyTestDto, userId);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
      }
      case ROLE_ADMIN -> {
        dictBodyTestService.addDictBodyTest(newDictBodyTestDto);
        return new ResponseEntity<>(HttpStatus.CREATED);
      }
      default -> throw new IllegalArgumentException("Unexpected role: " + userRole);
    }
  }

  @GetMapping("/get_body_test_basic")
  public ResponseEntity<List<DictBodyTestDto>> getExerciseBasic(
  ) {
    var userId = extractUserId();
    try {
      var result = dictBodyTestService.getDictBodyTest(userId);
      return new ResponseEntity<>(result, HttpStatus.CREATED);
    } catch (NullPointerException e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
  }

  @GetMapping("/get_body_test_per_user")
  public ResponseEntity<List<DictBodyTestDto>> getExercisesPerUser(
  ) {
    var userId = extractUserId();
    try {
      var result = dictBodyTestService.getDictBodyTest(userId);
      return new ResponseEntity<>(result, HttpStatus.CREATED);
    } catch (NullPointerException e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
  }

  @GetMapping("/get_body_test_details/{id}")
  public ResponseEntity<TranslationsDictBodyTestDto> getTranslations(
      @PathVariable("id") UUID id
  ) {
    var role = extractUserRole();
    try {
      var result = dictBodyTestService.getDetails(id, role);
      return new ResponseEntity<>(result, HttpStatus.OK);
    } catch (NullPointerException e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
  }

  @PatchMapping("/update_dict_body_test_translations")
  public ResponseEntity<String> updateTranslations(@RequestBody TranslationsDictBodyTestDto translationsDictBodyTestDto) {
    var role = extractUserRole();
    try {
      dictBodyTestService.updateTranslations(translationsDictBodyTestDto, role);
      return new ResponseEntity<>(null, HttpStatus.CREATED);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
  }

  @DeleteMapping("/delete_body_test/{itemToDelete}")
  public ResponseEntity<String> deleteCategoryBasic(
      @PathVariable("itemToDelete") UUID itemToDelete
  ) {
    var userRole = extractUserRole();
    var userId = extractUserId();
    try {
      dictBodyTestService.deleteDictBodyTest(userId, userRole, itemToDelete);
      return new ResponseEntity<>(HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
  }
}
