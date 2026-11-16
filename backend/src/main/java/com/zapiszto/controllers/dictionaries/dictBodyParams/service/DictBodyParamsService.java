package com.zapiszto.controllers.dictionaries.dictBodyParams.service;

import com.zapiszto.controllers.dictionaries.dictBodyParams.dto.DictBodyParamsDto;
import com.zapiszto.controllers.dictionaries.dictBodyParams.dto.NewDictBodyParamDto;
import com.zapiszto.controllers.dictionaries.dictBodyParams.dto.TranslationsDictBodyParamsDto;
import com.zapiszto.controllers.dictionaries.dictBodyParams.entity.DictBodyParamsEntity;
import com.zapiszto.controllers.dictionaries.dictBodyParams.serializer.DictBodyParamsSerializer;
import com.zapiszto.controllers.dictionaries.dictBodyParams.repository.DictBodyParamsRepository;
import com.zapiszto.controllers.dictionaries.dictLanguages.options.Languages;
import com.zapiszto.controllers.userDetails.repository.UserDetailsRepository;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@AllArgsConstructor
public class DictBodyParamsService {

  @Autowired
  DictBodyParamsRepository dictBodyParamsRepository;

  @Autowired
  DictBodyParamsSerializer dictBodyParamsSerializer;

  @Autowired
  UserDetailsRepository userDetailsRepository;

  public List<DictBodyParamsDto> getDictBodyParams(Long userId) {
    var dictBodyParamsEntityList = dictBodyParamsRepository.findAll();
    Languages lang = userDetailsRepository.userLanguage(userId);

    return dictBodyParamsSerializer.convertEntityToDto(dictBodyParamsEntityList, lang);
  }

  public void saveDictBodyParams(NewDictBodyParamDto dictBodyParamDto) {
    DictBodyParamsEntity dictBodyParamsEntity = dictBodyParamsSerializer.convert(dictBodyParamDto);
    dictBodyParamsRepository.save(dictBodyParamsEntity);
  }

  public void deleteDictCategory(Integer itemToDelete) {
    dictBodyParamsRepository.deleteById(itemToDelete);
  }

  public TranslationsDictBodyParamsDto getDetails(Integer id) {
    var bodyParamEntity = dictBodyParamsRepository.getReferenceById(id);
    return new TranslationsDictBodyParamsDto(
        bodyParamEntity.getId(),
        bodyParamEntity.getName(),
        bodyParamEntity.getDescription()
    );
  }

  public void updateNameDescription(TranslationsDictBodyParamsDto translationsDictBodyParamsDto) {
    var bodyParamEntity = dictBodyParamsRepository.getReferenceById(translationsDictBodyParamsDto.id());
    bodyParamEntity.setName(translationsDictBodyParamsDto.name());
    bodyParamEntity.setDescription(translationsDictBodyParamsDto.description());
    dictBodyParamsRepository.save(bodyParamEntity);
  }
}
