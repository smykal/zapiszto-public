package com.zapiszto.controllers.dictionaries.dictTags.service;

import com.zapiszto.controllers.account.entity.ERole;
import com.zapiszto.controllers.dictionaries.dictLanguages.options.Languages;
import com.zapiszto.controllers.dictionaries.dictTags.dictTagsBasic.entity.DictTagsBasicEntity;
import com.zapiszto.controllers.dictionaries.dictTags.dictTagsBasic.repository.DictTagsBasicRepository;
import com.zapiszto.controllers.dictionaries.dictTags.dictTagsCategory.repository.DictTagsCategoryRepository;
import com.zapiszto.controllers.dictionaries.dictTags.dictTagsPerUser.repository.DictTagsPerUserRepository;
import com.zapiszto.controllers.dictionaries.dictTags.dto.DictTagsDto;
import com.zapiszto.controllers.dictionaries.dictTags.dto.NewDictTagsDto;
import com.zapiszto.controllers.dictionaries.dictTags.dto.TranslationsDictTagsDto;
import com.zapiszto.controllers.dictionaries.dictTags.entity.DictTagsEntity;
import com.zapiszto.controllers.dictionaries.dictTags.repository.DictTagsRepository;
import com.zapiszto.controllers.dictionaries.dictTags.serializer.DictTagsSerializer;
import com.zapiszto.controllers.userDetails.repository.UserDetailsRepository;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DictTagsService {

  @Autowired
  DictTagsRepository dictTagsRepository;

  @Autowired
  UserDetailsRepository userDetailsRepository;

  @Autowired
  DictTagsCategoryRepository dictTagsCategoryRepository;

  @Autowired
  DictTagsBasicRepository dictTagsBasicRepository;

  @Autowired
  DictTagsPerUserRepository dictTagsPerUserRepository;

  @Autowired
  DictTagsSerializer dictTagsSerializer;

  public List<DictTagsDto> getDictTags(Long userId) {
    Languages lang = userDetailsRepository.userLanguage(userId);
    var all = dictTagsRepository.findAll();


    return all.stream()
        .map(dictTagsEntity -> dictTagsSerializer.convert(dictTagsEntity, lang))
        .toList();  }


  public List<DictTagsDto> getTagsForBodyPhotos(Long userId, UUID photoId) {
    Languages lang = userDetailsRepository.userLanguage(userId);
    var all = dictTagsRepository.findTagsForBodyPhoto(photoId);

    return all.stream()
        .map(dictTagsEntity -> dictTagsSerializer.convert(dictTagsEntity, lang))
        .toList();
  }

  public void addDictTags(NewDictTagsDto dto, Long userId) {
    var category = dictTagsCategoryRepository.getReferenceById(dto.category().id());
    var language = userDetailsRepository.userLanguage(userId).name();

    HashMap<String, String> name = new HashMap<>();
    name.put(language, dto.name());

    HashMap<String, String> description = new HashMap<>();
    description.put("en", dto.description());


    if ("BASIC".equals(dto.dict())) {


      var basic = DictTagsBasicEntity.builder()
          .id(dto.dict_id())
          .name(name)
          .description(description)
          .build();

      dictTagsBasicRepository.save(basic);

      var tag = DictTagsEntity.builder()
          .id(dto.id())
          .dictTagsCategoryEntity(category)
          .dictTagsBasicEntity(basic)
          .build();

      dictTagsRepository.save(tag);

    } else if ("PER_USER".equals(dto.dict())) {
      throw new UnsupportedOperationException("PER_USER not implemented yet");
    }
  }

  public TranslationsDictTagsDto getDictTagsDetails(UUID dictTagId, ERole role) {


    return switch (role) {
      case ROLE_USER, ROLE_TRAINER -> {
        var perUserEntity = dictTagsPerUserRepository.getReferenceById(dictTagId);
        yield new TranslationsDictTagsDto(
            perUserEntity.getId(),
            perUserEntity.getName(),
            perUserEntity.getDescription()
        );
      }
      case ROLE_ADMIN -> {
        var basicEntity = dictTagsBasicRepository.getReferenceById(dictTagId);
        yield new TranslationsDictTagsDto(
            basicEntity.getId(),
            basicEntity.getName(),
            basicEntity.getDescription()
        );
      }
      default -> throw new IllegalArgumentException("Unexpected role: " + role);
    };
  }

  public void updateTranslations(TranslationsDictTagsDto translationsDictTagsDto, ERole role) {
    switch (role) {
      case ROLE_USER, ROLE_TRAINER -> {
        var perUserEntity = dictTagsPerUserRepository.findById(translationsDictTagsDto.id())
            .orElseThrow(() -> new RuntimeException("Entity not found"));
        perUserEntity.setName(translationsDictTagsDto.name());
        dictTagsPerUserRepository.save(perUserEntity);
      }
      case ROLE_ADMIN -> {
        var perBasicEntity = dictTagsBasicRepository.findById(translationsDictTagsDto.id())
            .orElseThrow(() -> new RuntimeException("Entity not found"));
        perBasicEntity.setName(translationsDictTagsDto.name());
        dictTagsBasicRepository.save(perBasicEntity);
      }
      default -> throw new IllegalArgumentException("Unexpected role: " + role);
    }
  }

  @Transactional
  public void deleteDictTags(Long userId, ERole userRole, UUID itemToDelete) {
    switch (userRole) {
      case ROLE_USER, ROLE_TRAINER -> {
        dictTagsRepository.deleteDictTags(itemToDelete);
        dictTagsRepository.deleteDictTagsPerUser(itemToDelete, userId);
      }
      case ROLE_ADMIN -> {
        dictTagsRepository.deleteDictTags(itemToDelete);
        dictTagsRepository.deleteDictTagsBasic(itemToDelete);
      }
      default -> throw new IllegalArgumentException("Unexpected role: " + userRole);
    }
  }
}
