package com.zapiszto.controllers.dictionaries.dictEquipment.controller;

import static com.zapiszto.controllers.account.entity.ERole.*;

import com.zapiszto.controllers.common.ControllerCommon;
import com.zapiszto.controllers.dictionaries.dictEquipment.dto.DictEquipmentDto;
import com.zapiszto.controllers.dictionaries.dictEquipment.dto.NewDictEquipmentDto;
import com.zapiszto.controllers.dictionaries.dictEquipment.dto.TranslationsDictEquipmentDto;
import com.zapiszto.controllers.dictionaries.dictEquipment.service.DictEquipmentService;
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
public class DictEquipmentController implements ControllerCommon {

  @Autowired
  DictEquipmentService dictEquipmentService;

  @PostMapping("/add_equipment_per_user")
  public ResponseEntity<String> addUnitsPerUser(
      @RequestBody NewDictEquipmentDto newDictEquipmentDto
  ) {
    var userId = extractUserId();
    dictEquipmentService.addDictEquipment(newDictEquipmentDto, userId);
    return new ResponseEntity<>(HttpStatus.CREATED);
  }

  @PostMapping("/add_equipment_basic")
  public ResponseEntity<String> addUnitsBasic(
      @RequestBody NewDictEquipmentDto newDictEquipmentDto
  ) {
    var role = extractUserRole();
    if (role.equals(ROLE_ADMIN)) {
      try {
        dictEquipmentService.addDictEquipment(newDictEquipmentDto);
        return new ResponseEntity<>(HttpStatus.CREATED);
      } catch (NullPointerException e) {
        return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
      }
    } else {
      return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }
  }

  @GetMapping("/get_equipment_per_user")
  public ResponseEntity<List<DictEquipmentDto>> getUnitsPerUser(
  ) {
    var userId = extractUserId();
    try {
      var result = dictEquipmentService.getDictEquipment(userId);
      return new ResponseEntity<>(result, HttpStatus.CREATED);
    } catch (NullPointerException e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
  }

  @GetMapping("/get_equipment_details/{id}")
  public ResponseEntity<TranslationsDictEquipmentDto> getTranslations(
      @PathVariable("id") UUID id
  ) {
    var role = extractUserRole();
    try {
      var result = dictEquipmentService.getDetails(id, role);
      return new ResponseEntity<>(result, HttpStatus.OK);
    } catch (NullPointerException e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
  }

  @PatchMapping("/update_dict_equipment_translations")
  public ResponseEntity<String> updateTranslations(@RequestBody TranslationsDictEquipmentDto translationsDictEquipmentDto) {
    var role = extractUserRole();
    try {
      dictEquipmentService.updateTranslations(translationsDictEquipmentDto, role);
      return new ResponseEntity<>(null, HttpStatus.CREATED);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
  }

  @DeleteMapping("/delete_equipment/{itemToDelete}")
  public ResponseEntity<String> deleteExerciseBasic(
      @PathVariable("itemToDelete") int itemToDelete
  ) {
    var userRole = extractUserRole();
    var userId = extractUserId();
    try {
      dictEquipmentService.deleteDictEquipment(userId, userRole, itemToDelete);
      return new ResponseEntity<>(HttpStatus.CREATED);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
  }
}
