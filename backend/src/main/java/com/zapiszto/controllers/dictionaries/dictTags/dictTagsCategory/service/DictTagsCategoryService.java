package com.zapiszto.controllers.dictionaries.dictTags.dictTagsCategory.service;

import com.zapiszto.controllers.dictionaries.dictLanguages.options.Languages;
import com.zapiszto.controllers.dictionaries.dictTags.dictTagsCategory.dto.DictTagsCategoryDto;
import com.zapiszto.controllers.dictionaries.dictTags.dictTagsCategory.dto.NewDictTagsCategoryDto;
import com.zapiszto.controllers.dictionaries.dictTags.dictTagsCategory.entity.DictTagsCategoryEntity;
import com.zapiszto.controllers.dictionaries.dictTags.dictTagsCategory.repository.DictTagsCategoryRepository;
import com.zapiszto.controllers.dictionaries.dictTags.dictTagsCategory.serializer.DictTagsCategorySerializer;
import com.zapiszto.controllers.userDetails.repository.UserDetailsRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DictTagsCategoryService {

  @Autowired
  UserDetailsRepository userDetailsRepository;

  @Autowired
  DictTagsCategoryRepository dictTagsCategoryRepository;

  @Autowired
  DictTagsCategorySerializer dictTagsCategorySerializer;


  public List<DictTagsCategoryDto> getDictTagsCategory(Long userId) {
    List<DictTagsCategoryEntity> all = dictTagsCategoryRepository.findAll();
    Languages lang = userDetailsRepository.userLanguage(userId);

    return all.stream()
        .map(dictTagsCategoryEntity -> dictTagsCategorySerializer.convert(dictTagsCategoryEntity,lang))
        .collect(Collectors.toList());
  }

  public void addDictTagsCategory(NewDictTagsCategoryDto dictTagsCategoryDto) {
    var entity = dictTagsCategorySerializer.convert(dictTagsCategoryDto);
    dictTagsCategoryRepository.save(entity);
  }
}
