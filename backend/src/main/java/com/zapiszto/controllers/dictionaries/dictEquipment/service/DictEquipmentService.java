package com.zapiszto.controllers.dictionaries.dictEquipment.service;

import com.zapiszto.controllers.account.entity.ERole;
import com.zapiszto.controllers.dictionaries.dictCategory.dto.TranslationsDictCategoryDto;
import com.zapiszto.controllers.dictionaries.dictEquipment.dictEquipmentBasic.entity.DictEquipmentBasicEntity;
import com.zapiszto.controllers.dictionaries.dictEquipment.dictEquipmentBasic.repository.DictEquipmentBasicRepository;
import com.zapiszto.controllers.dictionaries.dictEquipment.dictEquipmentPerUser.entity.DictEquipmentPerUserEntity;
import com.zapiszto.controllers.dictionaries.dictEquipment.dictEquipmentPerUser.repository.DictEquipmentPerUserRepository;
import com.zapiszto.controllers.dictionaries.dictEquipment.dto.DictEquipmentDto;
import com.zapiszto.controllers.dictionaries.dictEquipment.dto.NewDictEquipmentDto;
import com.zapiszto.controllers.dictionaries.dictEquipment.dto.TranslationsDictEquipmentDto;
import com.zapiszto.controllers.dictionaries.dictEquipment.entity.DictEquipmentEntity;
import com.zapiszto.controllers.dictionaries.dictEquipment.repository.DictEquipmentRepository;
import com.zapiszto.controllers.dictionaries.dictEquipment.serializer.DictEquipmentSerializer;
import com.zapiszto.controllers.dictionaries.dictLanguages.options.Languages;
import com.zapiszto.controllers.userDetails.repository.UserDetailsRepository;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class DictEquipmentService {
  @Autowired
  DictEquipmentRepository dictEquipmentRepository;

  @Autowired
  DictEquipmentBasicRepository dictEquipmentBasicRepository;

  @Autowired
  DictEquipmentPerUserRepository dictEquipmentPerUserRepository;

  @Autowired
  UserDetailsRepository userDetailsRepository;

  public void addDictEquipment(NewDictEquipmentDto newDictEquipmentDto, Long userId) {
    var item = DictEquipmentPerUserEntity.builder()
        .name(newDictEquipmentDto.name())
        .user_id(userId)
        .build();

    DictEquipmentPerUserEntity dictEquipmentPerUserEntity = dictEquipmentPerUserRepository.save(item);

    log.info(
        "add new item to dict_units_per_user: id {}, value {}, user {}",
        dictEquipmentPerUserEntity.getId(),
        newDictEquipmentDto.name(),
        userId
    );

    DictEquipmentEntity dictEquipmentEntity = DictEquipmentEntity.builder()
        .dictEquipmentPerUserEntity(dictEquipmentPerUserEntity)
        .build();

    dictEquipmentRepository.save(dictEquipmentEntity);

    log.info(
        "updated dict_units by new item with id: {}, dict_units_per_user_id: {} ",
        dictEquipmentEntity.getId(),
        dictEquipmentEntity.getDictEquipmentPerUserEntity()
            .getId()
    );
  }

  public void addDictEquipment(NewDictEquipmentDto newDictEquipmentDto) {
    var item = DictEquipmentBasicEntity.builder()
        .name(newDictEquipmentDto.name())
        .build();

    DictEquipmentBasicEntity dictEquipmentBasicEntity = dictEquipmentBasicRepository.save(item);

    log.info(
        "add new item to dict_units_basic: id {}, value {}, shortcut {}",
        dictEquipmentBasicEntity.getId(),
        newDictEquipmentDto.name()
    );

    DictEquipmentEntity dictEquipmentEntity = DictEquipmentEntity.builder()
        .dictEquipmentBasicEntity(dictEquipmentBasicEntity)
        .build();

    dictEquipmentRepository.save(dictEquipmentEntity);

    log.info(
        "updated dict_units by new item with id: {}, dict_units_basic_id: {} ",
        dictEquipmentEntity.getId(),
        dictEquipmentEntity.getDictEquipmentBasicEntity()
            .getId()
    );
  }

  public List<DictEquipmentDto> getDictEquipment(Long userId) {
    List<DictEquipmentEntity> all = dictEquipmentRepository.getAllForUser(userId);
    Languages lang = userDetailsRepository.userLanguage(userId);

    return all.stream()
        .map(dictEquipmentEntity -> DictEquipmentSerializer.convert(dictEquipmentEntity, lang))
        .collect(Collectors.toList());

  }

  public String deleteDictEquipment(Long userId, ERole role, int itemToDelete) {
    switch (role) {
      case ROLE_USER, ROLE_TRAINER -> {
        dictEquipmentRepository.deleteDictEquipmentPerUser(itemToDelete);
        dictEquipmentRepository.deleteDictEquipmentPerUser(itemToDelete, userId);
        log.info("deleted dict_unit_per_user with id: {}, user: {}", itemToDelete, userId);
        return "ok";
      }
      case ROLE_ADMIN -> {
        dictEquipmentRepository.deleteDictEquipment(itemToDelete);
        dictEquipmentRepository.deleteDictEquipmentBasic(itemToDelete);
        log.info("deleted dict_unit_basic with id: {}, user: {}", itemToDelete, userId);
        return "ok";
      }
      default -> throw new IllegalArgumentException("Unexpected role: " + role);
    }
  }

  public TranslationsDictEquipmentDto getDetails(UUID id, ERole role) {
    return switch (role) {
      case ROLE_USER, ROLE_TRAINER -> {
        var perUserEntity = dictEquipmentPerUserRepository.getReferenceById(id);
        yield new TranslationsDictEquipmentDto(
            perUserEntity.getId(),
            perUserEntity.getName()
        );
      }
      case ROLE_ADMIN -> {
        var basicEntity = dictEquipmentBasicRepository.getReferenceById(id);
        yield new TranslationsDictEquipmentDto(
            basicEntity.getId(),
            basicEntity.getName()
        );
      }
      default -> throw new IllegalArgumentException("Unexpected role: " + role);
    };
  }

  public void updateTranslations(TranslationsDictEquipmentDto translationsDictEquipmentDto, ERole role) {
    switch (role) {
      case ROLE_USER, ROLE_TRAINER -> {
        var perUserEntity = dictEquipmentPerUserRepository.findById(translationsDictEquipmentDto.id())
            .orElseThrow(() -> new RuntimeException("Entity not found"));
        perUserEntity.setName(translationsDictEquipmentDto.name());
        dictEquipmentPerUserRepository.save(perUserEntity);
      }
      case ROLE_ADMIN -> {
        var perBasicEntity = dictEquipmentBasicRepository.findById(translationsDictEquipmentDto.id())
            .orElseThrow(() -> new RuntimeException("Entity not found"));
        perBasicEntity.setName(translationsDictEquipmentDto.name());
        dictEquipmentBasicRepository.save(perBasicEntity);
      }
      default -> throw new IllegalArgumentException("Unexpected role: " + role);
    }
  }
}
