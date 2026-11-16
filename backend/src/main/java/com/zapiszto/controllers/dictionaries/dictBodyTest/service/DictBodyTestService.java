package com.zapiszto.controllers.dictionaries.dictBodyTest.service;

import com.zapiszto.controllers.account.entity.ERole;
import com.zapiszto.controllers.dictionaries.dictBodyTest.dictBodyTestBasic.entity.DictBodyTestBasicEntity;
import com.zapiszto.controllers.dictionaries.dictBodyTest.dictBodyTestBasic.repository.DictBodyTestBasicRepository;
import com.zapiszto.controllers.dictionaries.dictBodyTest.dictBodyTestPerUser.entity.DictBodyTestPerUserEntity;
import com.zapiszto.controllers.dictionaries.dictBodyTest.dictBodyTestPerUser.repository.DictBodyTestPerUserRepository;
import com.zapiszto.controllers.dictionaries.dictBodyTest.dto.DictBodyTestDto;
import com.zapiszto.controllers.dictionaries.dictBodyTest.dto.NewDictBodyTestDto;
import com.zapiszto.controllers.dictionaries.dictBodyTest.dto.TranslationsDictBodyTestDto;
import com.zapiszto.controllers.dictionaries.dictBodyTest.entity.DictBodyTestEntity;
import com.zapiszto.controllers.dictionaries.dictBodyTest.repository.DictBodyTestRepository;
import com.zapiszto.controllers.dictionaries.dictBodyTest.serializer.DictBodyTestSerializer;
import com.zapiszto.controllers.dictionaries.dictLanguages.options.Languages;
import com.zapiszto.controllers.dictionaries.dictQuantityType.dto.TranslationsDictQuantityTypeDto;
import com.zapiszto.controllers.userDetails.repository.UserDetailsRepository;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
public class DictBodyTestService {

  @Autowired
  DictBodyTestPerUserRepository dictBodyTestPerUserRepository;

  @Autowired
  DictBodyTestRepository dictBodyTestRepository;

  @Autowired
  DictBodyTestBasicRepository dictBodyTestBasicRepository;

  @Autowired
  UserDetailsRepository userDetailsRepository;

  @Transactional
  public DictBodyTestDto addDictBodyTest(NewDictBodyTestDto newDictBodyTestDto, Long userId) {
    Languages lang = userDetailsRepository.userLanguage(userId);
    var item = DictBodyTestPerUserEntity.builder()
        .id(newDictBodyTestDto.id())
        .name(newDictBodyTestDto.name())
        .user_id(userId)
        .description(newDictBodyTestDto.description())
        .purpose(newDictBodyTestDto.purpose())
        .build();

    DictBodyTestPerUserEntity dictBodyTestPerUserEntity = dictBodyTestPerUserRepository.save(item);

    log.info(
        "add new item to dict_body_test_per_user: id {}, value {}, user {}",
        dictBodyTestPerUserEntity.getId(),
        newDictBodyTestDto.name(),
        userId
    );

    DictBodyTestEntity dictBodyTestEntity = DictBodyTestEntity.builder()
        .id(UUID.randomUUID())
        .dictBodyTestPerUserEntity(dictBodyTestPerUserEntity)
        .build();

    DictBodyTestEntity entity = dictBodyTestRepository.save(dictBodyTestEntity);


    log.info(
        "updated dict_body_test by new item with id: {}, dict_body_test_per_user_id: {} ",
        dictBodyTestEntity.getId(),
        dictBodyTestEntity.getDictBodyTestPerUserEntity()
            .getId()
    );

    return DictBodyTestSerializer.convert(entity, lang);
  }

  @Transactional
  public void addDictBodyTest(NewDictBodyTestDto newDictBodyTestDto) {
    var item = DictBodyTestBasicEntity.builder()
        .name(newDictBodyTestDto.name())
        .description(newDictBodyTestDto.description())
        .build();

    DictBodyTestBasicEntity dictBodyTestBasicEntity =
        dictBodyTestBasicRepository.save(item);

    log.info(
        "add new item to dict_BodyTest_basic: id {}, value {}",
        dictBodyTestBasicEntity.getId(),
        newDictBodyTestDto.name()
    );

    DictBodyTestEntity dictBodyTestEntity = DictBodyTestEntity.builder()
        .dictBodyTestBasicEntity(dictBodyTestBasicEntity)
        .build();

    dictBodyTestRepository.save(dictBodyTestEntity);

    log.info(
        "updated dict_BodyTest by new item with id: {}, dict_BodyTest_basic_id: {} ",
        dictBodyTestEntity.getId(),
        dictBodyTestEntity.getDictBodyTestBasicEntity()
            .getId()
    );
  }

  public List<DictBodyTestDto> getDictBodyTest(Long userId) {
    List<DictBodyTestEntity> all = dictBodyTestRepository.getAllForUser(userId);
    Languages lang = userDetailsRepository.userLanguage(userId);


    return all.stream()
        .map(dictBodyTestEntity -> DictBodyTestSerializer.convert(dictBodyTestEntity, lang))
        .collect(Collectors.toList());
  }

  @Modifying
  @Transactional
  public String deleteDictBodyTest(Long userId, ERole role, UUID itemToDelete) {
    switch (role) {
      case ROLE_USER, ROLE_TRAINER -> {
        dictBodyTestRepository.deleteDictBodyTestPerUser(itemToDelete);
        dictBodyTestRepository.deleteDictBodyTestPerUser(itemToDelete, userId);
        log.info("deleted dict_body_test_per_user with id: {}, user: {}", itemToDelete, userId);
        return "ok";
      }
      case ROLE_ADMIN -> {
        dictBodyTestRepository.deleteDictBodyTest(itemToDelete);
        dictBodyTestRepository.deleteDictBodyTestBasic(itemToDelete);
        log.info("deleted dict_body_test_per_user with id: {}, user: {}", itemToDelete, userId);
        return "ok";
      }
      default -> throw new IllegalArgumentException("Unexpected role: " + role);
    }
  }

  public TranslationsDictBodyTestDto getDetails(UUID id, ERole role) {
    return switch (role) {
      case ROLE_USER, ROLE_TRAINER -> {
        var perUserEntity = dictBodyTestPerUserRepository.getReferenceById(id);
        yield new TranslationsDictBodyTestDto(
            perUserEntity.getId(),
            perUserEntity.getName(),
            perUserEntity.getDescription(),
            perUserEntity.getPurpose()
        );
      }
      case ROLE_ADMIN -> {
        var basicEntity = dictBodyTestBasicRepository.getReferenceById(id);
        yield new TranslationsDictBodyTestDto(
            basicEntity.getId(),
            basicEntity.getName(),
            basicEntity.getDescription(),
            basicEntity.getPurpose()
        );
      }
      default -> throw new IllegalArgumentException("Unexpected role: " + role);
    };
  }

  public void updateTranslations(TranslationsDictBodyTestDto translationsDictBodyTestDto, ERole role) {
    switch (role) {
      case ROLE_USER, ROLE_TRAINER -> {
        var perUserEntity = dictBodyTestPerUserRepository.findById(translationsDictBodyTestDto.id())
            .orElseThrow(() -> new RuntimeException("Entity not found"));
        perUserEntity.setName(translationsDictBodyTestDto.name());
        perUserEntity.setDescription(translationsDictBodyTestDto.description());
        perUserEntity.setPurpose(translationsDictBodyTestDto.purpose());
        dictBodyTestPerUserRepository.save(perUserEntity);
      }
      case ROLE_ADMIN -> {
        var perBasicEntity = dictBodyTestBasicRepository.findById(translationsDictBodyTestDto.id())
            .orElseThrow(() -> new RuntimeException("Entity not found"));
        perBasicEntity.setName(translationsDictBodyTestDto.name());
        perBasicEntity.setDescription(translationsDictBodyTestDto.description());
        perBasicEntity.setPurpose(translationsDictBodyTestDto.purpose());
        dictBodyTestBasicRepository.save(perBasicEntity);
      }
      default -> throw new IllegalArgumentException("Unexpected role: " + role);
    }
  }
}
