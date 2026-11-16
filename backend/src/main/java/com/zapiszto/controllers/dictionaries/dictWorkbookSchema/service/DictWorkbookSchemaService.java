package com.zapiszto.controllers.dictionaries.dictWorkbookSchema.service;

import com.zapiszto.controllers.dictionaries.dictLanguages.options.Languages;
import com.zapiszto.controllers.dictionaries.dictWorkbookSchema.dto.DictWorkbookSchemaDto;
import com.zapiszto.controllers.dictionaries.dictWorkbookSchema.entity.DictWorkbookSchemaEntity;
import com.zapiszto.controllers.dictionaries.dictWorkbookSchema.repository.DictWorkbookSchemaRepository;
import com.zapiszto.controllers.dictionaries.dictWorkbookSchema.serializer.DictWorkbookSchemaSerializer;
import com.zapiszto.controllers.userDetails.repository.UserDetailsRepository;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@AllArgsConstructor
public class DictWorkbookSchemaService {

  @Autowired
  DictWorkbookSchemaRepository dictWorkbookSchemaRepository;

  @Autowired
  UserDetailsRepository userDetailsRepository;

  public List<DictWorkbookSchemaDto> getAll(Long userId) {
    List<DictWorkbookSchemaEntity> all = dictWorkbookSchemaRepository.findAll();
    Languages lang = userDetailsRepository.userLanguage(userId);

    return all.stream()
        .map(dictWorkbookSchemaEntity -> DictWorkbookSchemaSerializer.convert(dictWorkbookSchemaEntity, lang))
        .collect(Collectors.toList());
  }
}
