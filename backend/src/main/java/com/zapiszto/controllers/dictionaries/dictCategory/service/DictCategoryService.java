package com.zapiszto.controllers.dictionaries.dictCategory.service;

import com.zapiszto.controllers.account.entity.ERole;
import com.zapiszto.controllers.dictionaries.dictCategory.dictCategoryBasic.entity.DictCategoryBasicEntity;
import com.zapiszto.controllers.dictionaries.dictCategory.dictCategoryBasic.repository.DictCategoryBasicRepository;
import com.zapiszto.controllers.dictionaries.dictCategory.dictCategoryPerUser.entity.DictCategoryPerUserEntity;
import com.zapiszto.controllers.dictionaries.dictCategory.dictCategoryPerUser.repository.DictCategoryPerUserRepository;
import com.zapiszto.controllers.dictionaries.dictCategory.dto.NewDictCategoryDto;
import com.zapiszto.controllers.dictionaries.dictCategory.exceptions.CategoryInUseException;
import com.zapiszto.controllers.dictionaries.dictCategory.repository.DictCategoryRepository;
import com.zapiszto.controllers.dictionaries.dictCategory.dto.DictCategoryDto;
import com.zapiszto.controllers.dictionaries.dictCategory.entity.DictCategoryEntity;
import com.zapiszto.controllers.dictionaries.dictCategory.serializer.DictCategorySerializer;
import com.zapiszto.controllers.dictionaries.dictLanguages.options.Languages;
import com.zapiszto.controllers.dictionaries.dictCategory.dto.TranslationsDictCategoryDto;
import com.zapiszto.controllers.userDetails.repository.UserDetailsRepository;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
public class DictCategoryService {

  @Autowired
  DictCategoryRepository dictCategoryRepository;

  @Autowired
  DictCategoryBasicRepository dictCategoryBasicRepository;

  @Autowired
  DictCategoryPerUserRepository dictCategoryPerUserRepository;

  @Autowired
  UserDetailsRepository userDetailsRepository;

  @Transactional
  public DictCategoryDto addDictCategoryPerUser(NewDictCategoryDto newDictCategoryDto, Long userId) {
    Languages lang = userDetailsRepository.userLanguage(userId);
    var item = DictCategoryPerUserEntity.builder()
        .id(newDictCategoryDto.id())
        .name(newDictCategoryDto.name())
        .user_id(userId)
        .description(newDictCategoryDto.description())
        .build();

    DictCategoryPerUserEntity dictCategoryPerUserEntity = dictCategoryPerUserRepository.save(item);

    log.info(
        "add new item to dict_Category_per_user: id {}, value {}, user {}",
        dictCategoryPerUserEntity.getId(),
        newDictCategoryDto.name(),
        userId
    );

    DictCategoryEntity dictCategoryEntity = DictCategoryEntity.builder()
        .id(UUID.randomUUID())
        .dictCategoryPerUserEntity(dictCategoryPerUserEntity)
        .build();

    DictCategoryEntity entity = dictCategoryRepository.save(dictCategoryEntity);


    log.info(
        "updated dict_Category by new item with id: {}, dict_Category_per_user_id: {} ",
        dictCategoryEntity.getId(),
        dictCategoryEntity.getDictCategoryPerUserEntity()
            .getId()
    );

    return DictCategorySerializer.convert(entity, lang);
  }

  @Transactional
  public DictCategoryDto addDictCategoryBasic(NewDictCategoryDto newDictCategoryDto, Long userId) {
    Languages lang = userDetailsRepository.userLanguage(userId);
    var item = DictCategoryBasicEntity.builder()
        .name(newDictCategoryDto.name())
        .description(newDictCategoryDto.description())
        .build();

    DictCategoryBasicEntity dictCategoryBasicEntity =
        dictCategoryBasicRepository.save(item);

    log.info(
        "add new item to dict_Category_basic: id {}, value {}",
        dictCategoryBasicEntity.getId(),
        newDictCategoryDto.name()
    );

    DictCategoryEntity dictCategoryEntity = DictCategoryEntity.builder()
        .dictCategoryBasicEntity(dictCategoryBasicEntity)
        .build();

    DictCategoryEntity entity = dictCategoryRepository.save(dictCategoryEntity);

    log.info(
        "updated dict_Category by new item with id: {}, dict_Category_basic_id: {} ",
        dictCategoryEntity.getId(),
        dictCategoryEntity.getDictCategoryBasicEntity()
            .getId()
    );

    return DictCategorySerializer.convert(entity, lang);
  }

  public List<DictCategoryDto> getDictCategory(Long userId) {
    List<DictCategoryEntity> all = dictCategoryRepository.getAllForUser(userId);
    Languages lang = userDetailsRepository.userLanguage(userId);

    return all.stream()
        .map(dictCategoryEntity -> DictCategorySerializer.convert(dictCategoryEntity, lang))
        .collect(Collectors.toList());
  }

  @Modifying
  @Transactional
  public void deleteDictCategory(Long userId, ERole role, UUID itemToDelete) {

    var count = dictCategoryRepository.countExercisesForCategory(itemToDelete);
    if (count > 0) {
      throw new CategoryInUseException(count);
    } else {
      switch (role) {
        case ROLE_USER, ROLE_TRAINER -> {
          dictCategoryRepository.deleteDictCategoryPerUser(itemToDelete);
          dictCategoryRepository.deleteDictCategoryPerUser(itemToDelete, userId);
          log.info("deleted dict_Category_per_user with id: {}, user: {}", itemToDelete, userId);
        }
        case ROLE_ADMIN -> {
          dictCategoryRepository.deleteDictCategory(itemToDelete);
          dictCategoryRepository.deleteDictCategoryBasic(itemToDelete);
          log.info("deleted dict_Category_basic with id: {}, user: {}", itemToDelete, userId);
        }
        default -> throw new IllegalArgumentException("Unexpected role: " + role);
      }
    }
  }

  public TranslationsDictCategoryDto getDetails(UUID id, ERole role) {
    return switch (role) {
      case ROLE_USER, ROLE_TRAINER -> {
        var perUserEntity = dictCategoryPerUserRepository.getReferenceById(id);
        yield new TranslationsDictCategoryDto(
            perUserEntity.getId(),
            perUserEntity.getName(),
            perUserEntity.getDescription()
        );
      }
      case ROLE_ADMIN -> {
        var basicEntity = dictCategoryBasicRepository.getReferenceById(id);
        yield new TranslationsDictCategoryDto(
            basicEntity.getId(),
            basicEntity.getName(),
            basicEntity.getDescription()
        );
      }
      default -> throw new IllegalArgumentException("Unexpected role: " + role);
    };
  }

  public void updateNameDescription(TranslationsDictCategoryDto translationsDictCategoryDto) {
    var perUserEntity = dictCategoryPerUserRepository.findById(translationsDictCategoryDto.id())
        .orElseThrow(() -> new RuntimeException("Entity not found"));
    perUserEntity.setName(translationsDictCategoryDto.name());
    perUserEntity.setDescription(translationsDictCategoryDto.description());
    dictCategoryPerUserRepository.save(perUserEntity);
  }
}
  
