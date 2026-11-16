package com.zapiszto.controllers.dictionaries.dictUnits.service;

import com.zapiszto.controllers.account.entity.ERole;
import com.zapiszto.controllers.dictionaries.dictLanguages.options.Languages;
import com.zapiszto.controllers.dictionaries.dictUnits.dictUnitsBasic.entity.DictUnitsBasicEntity;
import com.zapiszto.controllers.dictionaries.dictUnits.dictUnitsBasic.repository.DictUnitsBasicRepository;
import com.zapiszto.controllers.dictionaries.dictUnits.dictUnitsPerUser.entity.DictUnitsPerUserEntity;
import com.zapiszto.controllers.dictionaries.dictUnits.dictUnitsPerUser.repository.DictUnitsPerUserRepository;
import com.zapiszto.controllers.dictionaries.dictUnits.dto.DictUnitsDto;
import com.zapiszto.controllers.dictionaries.dictUnits.dto.NewDictUnitDto;
import com.zapiszto.controllers.dictionaries.dictUnits.dto.TranslationsDictUnitDto;
import com.zapiszto.controllers.dictionaries.dictUnits.entity.DictUnitsEntity;
import com.zapiszto.controllers.dictionaries.dictUnits.repository.DictUnitsRepository;
import com.zapiszto.controllers.dictionaries.dictUnits.serializer.DictUnitsSerializer;
import com.zapiszto.controllers.userDetails.repository.UserDetailsRepository;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
public class DictUnitsService {

  @Autowired
  DictUnitsRepository dictUnitsRepository;

  @Autowired
  DictUnitsBasicRepository dictUnitsBasicRepository;

  @Autowired
  DictUnitsPerUserRepository dictUnitsPerUserRepository;

  @Autowired
  UserDetailsRepository userDetailsRepository;


  @Transactional
  public DictUnitsDto addDictUnitPerUser(NewDictUnitDto newDictUnitDto, Long userId) {
    var item = DictUnitsPerUserEntity.builder()
        .id(newDictUnitDto.id())
        .name(newDictUnitDto.name())
        .shortcut(newDictUnitDto.shortcut())
        .user_id(userId)
        .build();

    DictUnitsPerUserEntity dictUnitsPerUserEntity = dictUnitsPerUserRepository.save(item);

    log.info(
        "add new item to dict_units_per_user: id {}, value {}, shortcut {}, user {}",
        dictUnitsPerUserEntity.getId(),
        newDictUnitDto.name(),
        newDictUnitDto.shortcut(),
        userId
    );

    DictUnitsEntity dictUnitsEntity = DictUnitsEntity.builder()
        .dictUnitsPerUserEntity(dictUnitsPerUserEntity)
        .build();

    DictUnitsEntity entity = dictUnitsRepository.save(dictUnitsEntity);

    log.info(
        "updated dict_units by new item with id: {}, dict_units_per_user_id: {} ",
        dictUnitsEntity.getId(),
        dictUnitsEntity.getDictUnitsPerUserEntity()
            .getId()
    );

    return DictUnitsSerializer.convert(entity, Languages.en);
  }

  @Transactional
  public DictUnitsDto addDictUnitBasic(NewDictUnitDto newDictUnitDto) {
    var item = DictUnitsBasicEntity.builder()
        .id(newDictUnitDto.id())
        .name(newDictUnitDto.name())
        .shortcut(newDictUnitDto.shortcut())
        .build();

    DictUnitsBasicEntity dictUnitsBasicEntity = dictUnitsBasicRepository.save(item);

    log.info(
        "add new item to dict_units_basic: id {}, value {}, shortcut {}",
        dictUnitsBasicEntity.getId(),
        newDictUnitDto.name(),
        newDictUnitDto.shortcut()
    );

    DictUnitsEntity dictUnitsEntity = DictUnitsEntity.builder()
        .dictUnitsBasicEntity(dictUnitsBasicEntity)
        .build();

    DictUnitsEntity entity = dictUnitsRepository.save(dictUnitsEntity);

    log.info(
        "updated dict_units by new item with id: {}, dict_units_basic_id: {} ",
        dictUnitsEntity.getId(),
        dictUnitsEntity.getDictUnitsBasicEntity()
            .getId()
    );
    return DictUnitsSerializer.convert(entity, Languages.en);

  }

  public List<DictUnitsDto> getDictUnits(Long userId) {
    List<DictUnitsEntity> all = dictUnitsRepository.getAllForUser(userId);
    Languages lang = userDetailsRepository.userLanguage(userId);

    return all.stream()
        .map(dictUnitsEntity -> DictUnitsSerializer.convert(dictUnitsEntity, lang))
        .collect(Collectors.toList());
  }

  @Transactional
  public String deleteDictUnit(Long userId, ERole role, UUID itemToDelete) {
    switch (role) {
      case ROLE_USER, ROLE_TRAINER -> {
        dictUnitsRepository.deleteDictUnitPerUser(itemToDelete);
        dictUnitsRepository.deleteDictUnitPerUser(itemToDelete, userId);
        log.info("deleted dict_unit_per_user with id: {}, user: {}", itemToDelete, userId);
        return "ok";
      }
      case ROLE_ADMIN -> {
        dictUnitsRepository.deleteDictUnit(itemToDelete);
        dictUnitsRepository.deleteDictUnitBasic(itemToDelete);
        log.info("deleted dict_unit_basic with id: {}, user: {}", itemToDelete, userId);
        return "ok";
      }
      default -> throw new IllegalArgumentException("Unexpected role: " + role);
    }
  }

  public TranslationsDictUnitDto getDetails(UUID id, ERole role) {
    return switch (role) {
      case ROLE_USER, ROLE_TRAINER -> {
        var perUserEntity = dictUnitsPerUserRepository.getReferenceById(id);
        yield new TranslationsDictUnitDto(
            perUserEntity.getId(),
            perUserEntity.getName(),
            perUserEntity.getShortcut()
        );
      }
      case ROLE_ADMIN -> {
        var basicEntity = dictUnitsBasicRepository.getReferenceById(id);
        yield new TranslationsDictUnitDto(
            basicEntity.getId(),
            basicEntity.getName(),
            basicEntity.getShortcut()
        );
      }
      default -> throw new IllegalArgumentException("Unexpected role: " + role);
    };
  }

  public void updateTranslations(TranslationsDictUnitDto translationsDictUnitDto, ERole role) {
    switch (role) {
      case ROLE_USER, ROLE_TRAINER -> {
        var perUserEntity = dictUnitsPerUserRepository.findById(translationsDictUnitDto.id())
            .orElseThrow(() -> new RuntimeException("Entity not found"));
        perUserEntity.setName(translationsDictUnitDto.name());
        dictUnitsPerUserRepository.save(perUserEntity);
      }
      case ROLE_ADMIN -> {
        var perBasicEntity = dictUnitsBasicRepository.findById(translationsDictUnitDto.id())
            .orElseThrow(() -> new RuntimeException("Entity not found"));
        perBasicEntity.setName(translationsDictUnitDto.name());
        dictUnitsBasicRepository.save(perBasicEntity);
      }
      default -> throw new IllegalArgumentException("Unexpected role: " + role);
    }
  }
}
