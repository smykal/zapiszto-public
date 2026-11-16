package com.zapiszto.controllers.dictionaries.dictQuantityType.service;

import com.zapiszto.controllers.account.entity.ERole;
import com.zapiszto.controllers.dictionaries.dictLanguages.options.Languages;
import com.zapiszto.controllers.dictionaries.dictQuantityType.dictQuantityTypeBasic.entity.DictQuantityTypeBasicEntity;
import com.zapiszto.controllers.dictionaries.dictQuantityType.dictQuantityTypeBasic.repository.DictQuantityTypeBasicRepository;
import com.zapiszto.controllers.dictionaries.dictQuantityType.dictQuantityTypePerUser.entity.DictQuantityTypePerUserEntity;
import com.zapiszto.controllers.dictionaries.dictQuantityType.dictQuantityTypePerUser.repository.DictQuantityTypePerUserRepository;
import com.zapiszto.controllers.dictionaries.dictQuantityType.dto.DictQuantityTypeDto;
import com.zapiszto.controllers.dictionaries.dictQuantityType.dto.NewDictQuantityTypeDto;
import com.zapiszto.controllers.dictionaries.dictQuantityType.dto.TranslationsDictQuantityTypeDto;
import com.zapiszto.controllers.dictionaries.dictQuantityType.entity.DictQuantityTypeEntity;
import com.zapiszto.controllers.dictionaries.dictQuantityType.repository.DictQuantityTypeRepository;
import com.zapiszto.controllers.dictionaries.dictQuantityType.serializer.DictQuantityTypeSerializer;
import com.zapiszto.controllers.dictionaries.dictUnits.dto.TranslationsDictUnitDto;
import com.zapiszto.controllers.userDetails.repository.UserDetailsRepository;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
public class DictQuantityTypeService {

  @Autowired
  DictQuantityTypeRepository dictQuantityTypeRepository;

  @Autowired
  DictQuantityTypeBasicRepository dictQuantityTypeBasicRepository;

  @Autowired
  DictQuantityTypePerUserRepository dictQuantityTypePerUserRepository;

  @Autowired
  UserDetailsRepository userDetailsRepository;


  @Transactional
  public void addDictQuantityType(NewDictQuantityTypeDto newDictUnitDto, Long userId) {
    var item = DictQuantityTypePerUserEntity.builder()
        .id(newDictUnitDto.id())
        .name(newDictUnitDto.name())
        .shortcut(newDictUnitDto.shortcut())
        .user_id(userId)
        .build();

    DictQuantityTypePerUserEntity dictQuantityTypePerUserEntity = dictQuantityTypePerUserRepository.save(item);

    log.info(
        "add new item to dict_QuantityType_per_user: id {}, value {}, shortcut {}, user {}",
        dictQuantityTypePerUserEntity.getId(),
        newDictUnitDto.name(),
        newDictUnitDto.shortcut(),
        userId
    );

    DictQuantityTypeEntity dictQuantityTypeEntity = DictQuantityTypeEntity.builder()
        .id(UUID.randomUUID())
        .dictQuantityTypePerUserEntity(dictQuantityTypePerUserEntity)
        .build();

    dictQuantityTypeRepository.save(dictQuantityTypeEntity);

    log.info(
        "updated dict_QuantityType by new item with id: {}, dict_QuantityType_per_user_id: {} ",
        dictQuantityTypeEntity.getId(),
        dictQuantityTypeEntity.getDictQuantityTypePerUserEntity()
            .getId()
    );
  }

  @Transactional
  public void addDictQuantityType(NewDictQuantityTypeDto newDictUnitDto) {
    var item = DictQuantityTypeBasicEntity.builder()
        .name(newDictUnitDto.name())
        .shortcut(newDictUnitDto.shortcut())
        .build();

    DictQuantityTypeBasicEntity dictQuantityTypeBasicEntity = dictQuantityTypeBasicRepository.save(item);

    log.info(
        "add new item to dict_QuantityType_basic: id {}, value {}, shortcut {}",
        dictQuantityTypeBasicEntity.getId(),
        newDictUnitDto.name(),
        newDictUnitDto.shortcut()
    );

    DictQuantityTypeEntity dictQuantityTypeEntity = DictQuantityTypeEntity.builder()
        .dictQuantityTypeBasicEntity(dictQuantityTypeBasicEntity)
        .build();

    dictQuantityTypeRepository.save(dictQuantityTypeEntity);

    log.info(
        "updated dict_QuantityType by new item with id: {}, dict_QuantityType_basic_id: {} ",
        dictQuantityTypeEntity.getId(),
        dictQuantityTypeEntity.getDictQuantityTypeBasicEntity()
            .getId()
    );
  }

  public List<DictQuantityTypeDto> getDictQuantityType(Long userId) {
    List<DictQuantityTypeEntity> all = dictQuantityTypeRepository.getAllForUser(userId);
    Languages lang = userDetailsRepository.userLanguage(userId);

    return all.stream()
        .map(dictQuantityType -> DictQuantityTypeSerializer.convert(dictQuantityType, lang))
        .collect(Collectors.toList());
  }

  @Transactional
  public String deleteDictQuantityType(Long userId, ERole role, UUID itemToDelete) {
    switch (role) {
      case ROLE_USER, ROLE_TRAINER -> {
        dictQuantityTypeRepository.deleteDictQuantityTypePerUser(itemToDelete);
        dictQuantityTypeRepository.deleteDictQuantityTypePerUser(itemToDelete, userId);
        log.info("deleted dict_quantity_type_per_user with id: {}, user: {}", itemToDelete, userId);
        return "ok";
      }
      case ROLE_ADMIN -> {
        dictQuantityTypeRepository.deleteDictQuantityType(itemToDelete);
        dictQuantityTypeRepository.deleteDictQuantityTypeBasic(itemToDelete);
        log.info("deleted dict_quantity_type_per_user with id: {}, user: {}", itemToDelete, userId);
        return "ok";
      }
      default -> throw new IllegalArgumentException("Unexpected role: " + role);
    }
  }

  public TranslationsDictQuantityTypeDto getDetails(UUID id, ERole role) {
    return switch (role) {
      case ROLE_USER, ROLE_TRAINER -> {
        var perUserEntity = dictQuantityTypePerUserRepository.getReferenceById(id);
        yield new TranslationsDictQuantityTypeDto(
            perUserEntity.getId(),
            perUserEntity.getName(),
            perUserEntity.getShortcut()
        );
      }
      case ROLE_ADMIN -> {
        var basicEntity = dictQuantityTypeBasicRepository.getReferenceById(id);
        yield new TranslationsDictQuantityTypeDto(
            basicEntity.getId(),
            basicEntity.getName(),
            basicEntity.getShortcut()
        );
      }
      default -> throw new IllegalArgumentException("Unexpected role: " + role);
    };
  }

  public void updateTranslations(TranslationsDictQuantityTypeDto translationsDictQuantityTypeDto, ERole role) {
    switch (role) {
      case ROLE_USER, ROLE_TRAINER -> {
        var perUserEntity = dictQuantityTypePerUserRepository.findById(translationsDictQuantityTypeDto.id())
            .orElseThrow(() -> new RuntimeException("Entity not found"));
        perUserEntity.setName(translationsDictQuantityTypeDto.name());
        perUserEntity.setShortcut(translationsDictQuantityTypeDto.shortcut());
        dictQuantityTypePerUserRepository.save(perUserEntity);
      }
      case ROLE_ADMIN -> {
        var perBasicEntity = dictQuantityTypeBasicRepository.findById(translationsDictQuantityTypeDto.id())
            .orElseThrow(() -> new RuntimeException("Entity not found"));
        perBasicEntity.setName(translationsDictQuantityTypeDto.name());
        perBasicEntity.setShortcut(translationsDictQuantityTypeDto.shortcut());
        dictQuantityTypeBasicRepository.save(perBasicEntity);
      }
      default -> throw new IllegalArgumentException("Unexpected role: " + role);
    }
  }
}
