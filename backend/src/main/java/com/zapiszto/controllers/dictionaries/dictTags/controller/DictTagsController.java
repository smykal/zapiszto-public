package com.zapiszto.controllers.dictionaries.dictTags.controller;

import com.zapiszto.controllers.common.ControllerCommon;
import com.zapiszto.controllers.dictionaries.dictEquipment.dto.TranslationsDictEquipmentDto;
import com.zapiszto.controllers.dictionaries.dictExercises.dto.NewDictExerciseDto;
import com.zapiszto.controllers.dictionaries.dictTags.dto.DictTagsDto;
import com.zapiszto.controllers.dictionaries.dictTags.dto.NewDictTagsDto;
import com.zapiszto.controllers.dictionaries.dictTags.dto.TranslationsDictTagsDto;
import com.zapiszto.controllers.dictionaries.dictTags.service.DictTagsService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
@RestController
@RequestMapping("/v1")
@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN') or hasRole('TRAINER')")
public class DictTagsController implements ControllerCommon {

  @Autowired
  DictTagsService dictTagsService;

  @GetMapping("/get_tags_basic")
  public ResponseEntity<List<DictTagsDto>> getTagsBasic(
  ) {
    var userId = extractUserId();
    try {
      var result = dictTagsService.getDictTags(userId);
      return new ResponseEntity<>(result, HttpStatus.OK);
    } catch (NullPointerException e) {
      return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
    }
  }
  @GetMapping("/get_tags_basic_for_body_photo/{photoId}")
  public ResponseEntity<List<DictTagsDto>> getTagsForBodyPhotos(
      @PathVariable("photoId") UUID photoId
  ) {
    var userId = extractUserId();
    try {
      var result = dictTagsService.getTagsForBodyPhotos(userId, photoId);
      return new ResponseEntity<>(result, HttpStatus.OK);
    } catch (NullPointerException e) {
      return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
    }
  }


  @GetMapping("/get_tags_basic/{dictTagId}")
  public ResponseEntity<TranslationsDictTagsDto> getExerciseBasic(
      @RequestParam("dictTagId") UUID dictTagId
  ) {
    var role = extractUserRole();
    try {
      var result = dictTagsService.getDictTagsDetails(dictTagId, role );
      return new ResponseEntity<>(result, HttpStatus.OK);
    } catch (NullPointerException e) {
      return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
    }
  }

  @PostMapping("/add_tags_basic")
  public ResponseEntity<String> addTagsBasic(
      @RequestBody NewDictTagsDto newDictTagsDto
  ) {
    var userId = extractUserId();
    dictTagsService.addDictTags(newDictTagsDto, userId);
    return new ResponseEntity<>(HttpStatus.CREATED);
  }

  @PatchMapping("/update_dict_tags_translations")
  public ResponseEntity<String> updateTranslations(@RequestBody TranslationsDictTagsDto translationsDictTagsDto) {
    var role = extractUserRole();
    try {
      dictTagsService.updateTranslations(translationsDictTagsDto, role);
      return new ResponseEntity<>(null, HttpStatus.CREATED);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
  }

  @DeleteMapping("/dict_tag/{itemToDelete}")
  public ResponseEntity<String> deleteExerciseBasic(
      @PathVariable("itemToDelete") UUID itemToDelete
  ) {
    var userRole = extractUserRole();
    var userId = extractUserId();
    try {
      dictTagsService.deleteDictTags(userId, userRole, itemToDelete);
      return new ResponseEntity<>(HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }
  }


}
