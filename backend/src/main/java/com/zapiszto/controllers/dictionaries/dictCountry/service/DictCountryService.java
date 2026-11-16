package com.zapiszto.controllers.dictionaries.dictCountry.service;

import com.zapiszto.controllers.dictionaries.dictCountry.dto.DictCountryDto;
import com.zapiszto.controllers.dictionaries.dictCountry.entity.DictCountryEntity;
import com.zapiszto.controllers.dictionaries.dictCountry.repository.DictCountryRepository;
import com.zapiszto.controllers.dictionaries.dictCountry.serializer.DictCountrySerializer;
import com.zapiszto.controllers.dictionaries.dictLanguages.options.Languages;
import java.util.List;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class DictCountryService {

  @Autowired
  DictCountryRepository dictCountryRepository;

  public List<DictCountryDto> getAllCountries(Languages language) {
    List<DictCountryEntity> countries = dictCountryRepository.findAll();

    return countries.stream()
        .map(country -> DictCountrySerializer.convert(country, language))
        .collect(Collectors.toList());
  }

}
