package com.zapiszto.controllers.dictionaries.dictUnits.controller;

import com.zapiszto.controllers.account.entity.ERole;
import com.zapiszto.controllers.common.ControllerCommon;
import com.zapiszto.controllers.dictionaries.dictUnits.dto.DictUnitsDto;
import com.zapiszto.controllers.dictionaries.dictUnits.dto.NewDictUnitDto;
import com.zapiszto.controllers.dictionaries.dictUnits.dto.TranslationsDictUnitDto;
import com.zapiszto.controllers.dictionaries.dictUnits.service.DictUnitsService;
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
public class DictUnitsController implements ControllerCommon {

  @Autowired
  DictUnitsService dictUnitsService;

  @PostMapping("/add_units")
  public ResponseEntity<String> addUnitsPerUser(
      @RequestBody NewDictUnitDto newDictUnitDto
  ) {
    var userId = extractUserId();
    var userRole = extractUserRole();
    switch (userRole) {
      case ROLE_USER, ROLE_TRAINER -> {
        dictUnitsService.addDictUnitPerUser(newDictUnitDto, userId);
        return new ResponseEntity<>(HttpStatus.CREATED);
      }
      case ROLE_ADMIN -> {
        dictUnitsService.addDictUnitBasic(newDictUnitDto);
        return new ResponseEntity<>(HttpStatus.CREATED);
      }
      default -> throw new IllegalArgumentException("Unexpected role: " + userRole);
    }
  }

  @GetMapping("/get_units_per_user")
  public ResponseEntity<List<DictUnitsDto>> getUnitsPerUser(
  ) {
    var userId = extractUserId();
    try {
      var result = dictUnitsService.getDictUnits(userId);
      return new ResponseEntity<>(result, HttpStatus.CREATED);
    } catch (NullPointerException e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
  }

  @GetMapping("/get_unit_details/{id}")
  public ResponseEntity<TranslationsDictUnitDto> getTranslations(
      @PathVariable("id") UUID id
  ) {
    var role = extractUserRole();
    try {
      var result = dictUnitsService.getDetails(id, role);
      return new ResponseEntity<>(result, HttpStatus.OK);
    } catch (NullPointerException e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
  }

  @PatchMapping("/update_dict_unit_translations")
  public ResponseEntity<String> updateTranslations(@RequestBody TranslationsDictUnitDto translationsDictUnitDto) {
    var role = extractUserRole();
    try {
      dictUnitsService.updateTranslations(translationsDictUnitDto, role);
      return new ResponseEntity<>(null, HttpStatus.CREATED);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
  }

  @DeleteMapping("/delete_unit/{itemToDelete}")
  public ResponseEntity<String> deleteExerciseBasic(
      @PathVariable("itemToDelete") UUID itemToDelete
  ) {
    var userRole = extractUserRole();
    var userId = extractUserId();
    try {
      dictUnitsService.deleteDictUnit(userId, userRole, itemToDelete);
      return new ResponseEntity<>(HttpStatus.CREATED);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
  }
}

