package com.zapiszto.controllers.bodyParams.controller;

import com.zapiszto.controllers.common.ControllerCommon;
import com.zapiszto.controllers.bodyParams.dto.BodyMassIndexDto;
import com.zapiszto.controllers.bodyParams.dto.BodyParamsDto;
import com.zapiszto.controllers.bodyParams.dto.BodyParamsWithNameAndDateDto;
import com.zapiszto.controllers.bodyParams.dto.BodyParamsWithNameDto;
import com.zapiszto.controllers.bodyParams.service.BodyParamsService;
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
public class BodyParamsController implements ControllerCommon {

  @Autowired
  private BodyParamsService bodyParamsService;

  @GetMapping("/all_body_params")
  @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
  public ResponseEntity<List<BodyParamsWithNameAndDateDto>> getAllBodyParams() {
    var userId = extractUserId();
    try {
      var response = bodyParamsService.getAllBodyParameters(userId);
      return new ResponseEntity<>(response, HttpStatus.OK);
    } catch (NullPointerException e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
  }

  @GetMapping("/all_body_params/user/{userId}")
  @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN') or hasRole('TRAINER')")
  public ResponseEntity<List<BodyParamsWithNameAndDateDto>> getAllBodyParamsById(
      @PathVariable("userId") Long userId,
      @RequestParam(value = "clientId", required = false) UUID clientId
  ) {
    var trainerId = extractUserId();
    try {
      var response = bodyParamsService.getAllBodyParameters(userId, trainerId, clientId);
      return new ResponseEntity<>(response, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
  }

  @GetMapping("/all_body_params/client/{clientId}")
  @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN') or hasRole('TRAINER')")
  public ResponseEntity<List<BodyParamsWithNameAndDateDto>> getAllBodyParamsById(
      @PathVariable("clientId") UUID clientId,
      @RequestParam(value = "userId", required = false) Long userId

  ) {
    var trainerId = extractUserId();
    try {
      var response = bodyParamsService.getAllBodyParameters(userId, trainerId, clientId);
      return new ResponseEntity<>(response, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
  }

  @GetMapping("/actual_body_params")
  @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
  public ResponseEntity<List<BodyParamsWithNameDto>> getActualBodyParams() {
    var userId = extractUserId();
    try {
      var response = bodyParamsService.getActualBodyParametersWithName(userId);
      return new ResponseEntity<>(response, HttpStatus.OK);
    } catch (NullPointerException e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
  }

  @GetMapping("/actual_body_params/user/{userId}")
  @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN') or hasRole('TRAINER')")
  public ResponseEntity<List<BodyParamsWithNameDto>> getActualBodyParamsByUserId(
      @PathVariable("userId") Long userId,
      @RequestParam(value = "clientId", required = false) UUID clientId
  ) {
    var trainerId = extractUserId();
    try {
      var response = bodyParamsService.getActualBodyParametersWithName(userId, trainerId, clientId);
      return new ResponseEntity<>(response, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
  }

  @GetMapping("/actual_body_params/client/{clientId}")
  @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN') or hasRole('TRAINER')")
  public ResponseEntity<List<BodyParamsWithNameDto>> getActualBodyParamsByClientId(
      @PathVariable("clientId") UUID clientId,
      @RequestParam(value = "userId", required = false) Long userId
  ) {
    var trainerId = extractUserId();
    try {
      var response = bodyParamsService.getActualBodyParametersWithName(userId, trainerId, clientId);
      return new ResponseEntity<>(response, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
  }


  @GetMapping("/bmi")
  @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
  public ResponseEntity<List<BodyMassIndexDto>> getBmi() {
    var userId = extractUserId();
    try {
      var response = bodyParamsService.getBodyMassIndex(userId);
      return new ResponseEntity<>(response, HttpStatus.OK);
    } catch (NullPointerException e) {
      return new ResponseEntity<>(null, HttpStatus.CREATED);
    }
  }

  @PostMapping("/add_body_param")
  @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN') or hasRole('TRAINER')")
  public ResponseEntity<String> saveBodyParam(
     @RequestBody BodyParamsDto bodyParamsDto
  ) {
    var createdBy = extractUserId();
    try {
      bodyParamsService.saveBodyParam(bodyParamsDto, createdBy);
      return new ResponseEntity<>(HttpStatus.CREATED);
    } catch (NullPointerException e) {
      return new ResponseEntity<>(null, HttpStatus.CONFLICT);
    }
  }

  @PatchMapping("/update_body_param/id/{id}")
  public ResponseEntity<BodyParamsWithNameAndDateDto> updateName(@RequestBody BodyParamsWithNameAndDateDto bodyParamsWithNameAndDateDto) {
    var userId = extractUserId();
    try {
      var result = bodyParamsService.updateBodyParam(userId, bodyParamsWithNameAndDateDto);
      return new ResponseEntity<>(result, HttpStatus.CREATED);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
  }


  @DeleteMapping("/delete_body_param/id/{id}")
  @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('TRAINER')")
  public ResponseEntity<String> deleteCategoryPerUser(
      @PathVariable("id")  Integer itemToDelete){
    var userId = extractUserId();
    try {
      bodyParamsService.deleteBodyParam(userId, itemToDelete);
      return new ResponseEntity<>(HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
  }
}
