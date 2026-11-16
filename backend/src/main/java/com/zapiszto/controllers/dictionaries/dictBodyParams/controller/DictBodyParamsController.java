package com.zapiszto.controllers.dictionaries.dictBodyParams.controller;

import com.zapiszto.controllers.common.ControllerCommon;
import com.zapiszto.controllers.dictionaries.dictBodyParams.dto.DictBodyParamsDto;
import com.zapiszto.controllers.dictionaries.dictBodyParams.dto.NewDictBodyParamDto;
import com.zapiszto.controllers.dictionaries.dictBodyParams.dto.TranslationsDictBodyParamsDto;
import com.zapiszto.controllers.dictionaries.dictBodyParams.service.DictBodyParamsService;
import com.zapiszto.controllers.dictionaries.dictCategory.dto.TranslationsDictCategoryDto;
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
public class DictBodyParamsController implements ControllerCommon {

  @Autowired
  private DictBodyParamsService dictBodyParamsService;

  @GetMapping("/dictBodyParams")
  public ResponseEntity<List<DictBodyParamsDto>> getDictBodyParams() {
    var userId = extractUserId();
    try {
      var dictBodyParams = dictBodyParamsService.getDictBodyParams(userId);
      return new ResponseEntity<>(
          dictBodyParams,
          HttpStatus.OK
      );
    } catch (NullPointerException e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
  }

  @PostMapping("/add_dict_body_param")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<String> saveDictBodyParam(@RequestBody NewDictBodyParamDto dictBodyParamDto) {
    try {
      dictBodyParamsService.saveDictBodyParams(dictBodyParamDto);
      return new ResponseEntity<>(HttpStatus.CREATED);
    } catch (NullPointerException e) {
      return new ResponseEntity<>(null, HttpStatus.CONFLICT);
    }
  }

  @GetMapping("/get_dict_body_param_details/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<TranslationsDictBodyParamsDto> getTranslations(@PathVariable("id") Integer id) {
    try {
      var result = dictBodyParamsService.getDetails(id);
      return new ResponseEntity<>(result, HttpStatus.ACCEPTED);
    } catch (NullPointerException e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
  }

  @PatchMapping("/update_dict_body_param_name_description")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<String> updateName(@RequestBody TranslationsDictBodyParamsDto translationsDictBodyParamsDto) {
    try {
      dictBodyParamsService.updateNameDescription(translationsDictBodyParamsDto);
      return new ResponseEntity<>(null, HttpStatus.CREATED);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
  }

  @DeleteMapping("/delete_body_param/{itemToDelete}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<String> deleteCategoryPerUser(
      @PathVariable("itemToDelete") Integer itemToDelete
  ) {
    try {
      dictBodyParamsService.deleteDictCategory(itemToDelete);
      return new ResponseEntity<>(HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
  }
}
