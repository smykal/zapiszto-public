package com.zapiszto.controllers.dictionaries.dictCategory.controller;

import com.zapiszto.controllers.common.ControllerCommon;
import com.zapiszto.controllers.dictionaries.dictCategory.dto.DictCategoryDto;
import com.zapiszto.controllers.dictionaries.dictCategory.dto.NewDictCategoryDto;
import com.zapiszto.controllers.dictionaries.dictCategory.dto.TranslationsDictCategoryDto;
import com.zapiszto.controllers.dictionaries.dictCategory.service.DictCategoryService;
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
public class DictCategoryController implements ControllerCommon {

  @Autowired
  DictCategoryService dictCategoryService;

  @PostMapping("/add_category")
  public ResponseEntity<DictCategoryDto> addCategoryPerUser(
      @RequestBody NewDictCategoryDto newDictCategoryDto
  ) {
    var userId = extractUserId();
    var userRole = extractUserRole();
    switch (userRole) {
      case ROLE_USER, ROLE_TRAINER -> {
        DictCategoryDto result = dictCategoryService.addDictCategoryPerUser(newDictCategoryDto, userId);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
      }
      case ROLE_ADMIN -> {
        DictCategoryDto result = dictCategoryService.addDictCategoryBasic(newDictCategoryDto, userId);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
      }
      default -> throw new IllegalArgumentException("Unexpected role: " + userRole);
    }
  }

  @GetMapping("/get_category_basic")
  public ResponseEntity<List<DictCategoryDto>> getExerciseBasic(
  ) {
    var userId = extractUserId();
    try {
      var result = dictCategoryService.getDictCategory(userId);
      return new ResponseEntity<>(result, HttpStatus.CREATED);
    } catch (NullPointerException e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
  }

  @GetMapping("/get_category_per_user")
  public ResponseEntity<List<DictCategoryDto>> getExercisesPerUser(
  ) {
    var userId = extractUserId();
    try {
      var result = dictCategoryService.getDictCategory(userId);
      return new ResponseEntity<>(result, HttpStatus.CREATED);
    } catch (NullPointerException e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
  }

  @GetMapping("/get_dict_category_details/{id}")
  public ResponseEntity<TranslationsDictCategoryDto> getTranslations(@PathVariable("id") UUID id) {
    var role = extractUserRole();
    try {
      var result = dictCategoryService.getDetails(id, role);
      return new ResponseEntity<>(result, HttpStatus.ACCEPTED);
    } catch (NullPointerException e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
  }

  @PatchMapping("/update_dict_category_name_description")
  public ResponseEntity<String> updateName(@RequestBody TranslationsDictCategoryDto translationsDictCategoryDto) {
    try {
      dictCategoryService.updateNameDescription(translationsDictCategoryDto);
      return new ResponseEntity<>(null, HttpStatus.CREATED);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
  }

  @DeleteMapping("/delete_category/{itemToDelete}")
  public ResponseEntity<Void> deleteCategoryPerUser(
      @PathVariable UUID itemToDelete) {

    dictCategoryService.deleteDictCategory(
        extractUserId(),
        extractUserRole(),
        itemToDelete);

    return ResponseEntity.ok().build();
  }
}
