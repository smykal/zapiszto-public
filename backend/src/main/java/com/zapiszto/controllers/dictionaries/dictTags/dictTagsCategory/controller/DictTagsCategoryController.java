package com.zapiszto.controllers.dictionaries.dictTags.dictTagsCategory.controller;

import com.zapiszto.controllers.common.ControllerCommon;
import com.zapiszto.controllers.dictionaries.dictTags.dictTagsCategory.dto.DictTagsCategoryDto;
import com.zapiszto.controllers.dictionaries.dictTags.dictTagsCategory.dto.NewDictTagsCategoryDto;
import com.zapiszto.controllers.dictionaries.dictTags.dictTagsCategory.service.DictTagsCategoryService;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
@RestController
@RequestMapping("/v1")
@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN') or hasRole('TRAINER')")
public class DictTagsCategoryController implements ControllerCommon {

  @Autowired
  DictTagsCategoryService dictTagsCategoryService;

  @GetMapping("/dict_tags_category")
  public ResponseEntity<List<DictTagsCategoryDto>> getDictTagsCategory() {
    var userId = extractUserId();
    var response = dictTagsCategoryService.getDictTagsCategory(userId);
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @PostMapping("/dict_tags_category")
  public ResponseEntity<String> addDictTagsCategory(
      @RequestBody NewDictTagsCategoryDto dictTagsCategoryDto
  ) {
    var userRole = extractUserRole();
    if ("ROLE_ADMIN".equals(userRole.name())) {
      dictTagsCategoryService.addDictTagsCategory(dictTagsCategoryDto);
      return new ResponseEntity<>(HttpStatus.CREATED);
    }
    return new ResponseEntity<>(HttpStatus.FORBIDDEN);
  }
}
