package com.zapiszto.controllers.dictionaries.dictCountry.controller;

import com.zapiszto.controllers.dictionaries.dictCountry.dto.DictCountryDto;
import com.zapiszto.controllers.dictionaries.dictCountry.serializer.DictCountrySerializer;
import com.zapiszto.controllers.dictionaries.dictCountry.service.DictCountryService;
import com.zapiszto.controllers.dictionaries.dictLanguages.options.Languages;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
@RestController
@RequestMapping("/v1")
@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN') or hasRole('TRAINER')")
public class DictCountryController {

  @Autowired
  DictCountryService dictCountryService;

  @GetMapping("/get_countries")
  public List<DictCountryDto> getAllCountries(
      @RequestParam(name = "language", defaultValue = "en") Languages language
  ) {

    return dictCountryService.getAllCountries(language);
  }
}

