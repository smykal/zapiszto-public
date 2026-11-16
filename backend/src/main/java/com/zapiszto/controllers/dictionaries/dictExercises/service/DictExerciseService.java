package com.zapiszto.controllers.dictionaries.dictExercises.service;

import com.zapiszto.controllers.account.entity.ERole;
import com.zapiszto.controllers.dictionaries.dictCategory.entity.DictCategoryEntity;
import com.zapiszto.controllers.dictionaries.dictCategory.repository.DictCategoryRepository;
import com.zapiszto.controllers.dictionaries.dictExercises.dictExercisesBasic.entity.DictExercisesBasicEntity;
import com.zapiszto.controllers.dictionaries.dictExercises.dictExercisesBasic.repository.DictExercisesBasicRepository;
import com.zapiszto.controllers.dictionaries.dictExercises.dictExercisesPerUser.entity.DictExercisesPerUserEntity;
import com.zapiszto.controllers.dictionaries.dictExercises.dictExercisesPerUser.repository.DictExercisesPerUserRepository;
import com.zapiszto.controllers.dictionaries.dictExercises.dto.DictExercisesDto;
import com.zapiszto.controllers.dictionaries.dictExercises.dto.NewDictExerciseDto;
import com.zapiszto.controllers.dictionaries.dictExercises.entity.DictExercisesEntity;
import com.zapiszto.controllers.dictionaries.dictExercises.repository.DictExercisesRepository;
import com.zapiszto.controllers.dictionaries.dictExercises.serializer.DictExercisesSerializer;
import com.zapiszto.controllers.dictionaries.dictLanguages.options.Languages;
import com.zapiszto.controllers.dictionaries.dictExercises.dto.TranslationsDictExercisesDto;
import com.zapiszto.controllers.execrisesAttachments.repository.ExercisesAttachmentsRepository;
import com.zapiszto.controllers.userDetails.repository.UserDetailsRepository;
import java.util.HashSet;
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
public class DictExerciseService {

  @Autowired
  DictExercisesPerUserRepository dictExercisesPerUserRepository;

  @Autowired
  DictExercisesBasicRepository dictExercisesBasicRepository;

  @Autowired
  DictExercisesRepository dictExercisesRepository;

  @Autowired
  DictCategoryRepository dictCategoryRepository;

  @Autowired
  UserDetailsRepository userDetailsRepository;

  @Autowired
  ExercisesAttachmentsRepository exercisesAttachmentsRepository;


  @Transactional
  public DictExercisesDto addDictExercise(NewDictExerciseDto newDictExerciseDto, Long userId) {
    Languages lang = userDetailsRepository.userLanguage(userId);
    var item = DictExercisesPerUserEntity.builder()
        .id(newDictExerciseDto.id())
        .name(newDictExerciseDto.name())
        .user_id(userId)
        .dictCategoryId(newDictExerciseDto.categoryId())
        .build();

    DictExercisesPerUserEntity dictExercisesPerUserEntity = dictExercisesPerUserRepository.save(item);

    DictExercisesEntity dictExercisesEntity = DictExercisesEntity.builder()
        .dictExercisesPerUserEntity(dictExercisesPerUserEntity)
        .build();

    DictExercisesEntity entity = dictExercisesRepository.save(dictExercisesEntity);


    DictCategoryEntity dictCategoryEntity = dictCategoryRepository.getReferenceById(newDictExerciseDto.categoryId());
    dictExercisesPerUserEntity.setDictCategoryEntity(dictCategoryEntity);
    entity.setDictExercisesPerUserEntity(dictExercisesPerUserEntity);

    return DictExercisesSerializer.convert(entity, lang, new HashSet<>());
  }

  @Transactional
  public void addDictExercise(NewDictExerciseDto newDictExerciseDto) {
    var item = DictExercisesBasicEntity.builder()
        .id(newDictExerciseDto.id())
        .name(newDictExerciseDto.name())
        .build();

    DictExercisesBasicEntity dictExercisesBasicEntity =
        dictExercisesBasicRepository.save(item);

    DictExercisesEntity dictExercisesEntity = DictExercisesEntity.builder()
        .dictExercisesBasicEntity(dictExercisesBasicEntity)
        .build();

    dictExercisesRepository.save(dictExercisesEntity);
  }

  public List<DictExercisesDto> getDictExercises(Long userId) {
    List<DictExercisesEntity> all = dictExercisesRepository.getAllForUser(userId);
    var hasAttachments = new HashSet<>(exercisesAttachmentsRepository.getDictExercisesWithAttachments(userId));
    Languages lang = userDetailsRepository.userLanguage(userId);

    return all.stream()
        .map(dictExercisesEntity -> DictExercisesSerializer.convert(dictExercisesEntity, lang, hasAttachments))
        .collect(Collectors.toList());
  }

  @Transactional
  public void deleteDictExercise(Long userId, ERole role, UUID itemToDelete) {
    switch (role) {
      case ROLE_USER, ROLE_TRAINER -> {
        dictExercisesRepository.deleteDictExercisePerUser(itemToDelete);
        dictExercisesRepository.deleteDictExercisePerUser(itemToDelete, userId);
        log.info("deleted dict_exercises_per_user with id: {}, user: {}", itemToDelete, userId);
      }
      case ROLE_ADMIN -> {
        dictExercisesRepository.deleteDictExercise(itemToDelete);
        dictExercisesRepository.deleteDictExerciseBasic(itemToDelete);
        log.info("deleted dict_exercises_basic with id: {}, user: {}", itemToDelete, userId);
      }
      default -> throw new IllegalArgumentException("Unexpected role: " + role);
    }
  }

  public TranslationsDictExercisesDto getDetails(UUID id, ERole role) {
    return switch (role) {
      case ROLE_USER, ROLE_TRAINER -> {
        var perUserEntity = dictExercisesPerUserRepository.getReferenceById(id);
        yield new TranslationsDictExercisesDto(
            perUserEntity.getId(),
            perUserEntity.getName()
        );
      }
      case ROLE_ADMIN -> {
        var basicEntity = dictExercisesBasicRepository.getReferenceById(id);
        yield new TranslationsDictExercisesDto(
            basicEntity.getId(),
            basicEntity.getName()
        );
      }
      default -> throw new IllegalArgumentException("Unexpected role: " + role);
    };
  }

  @Transactional
  @Modifying
  public void updateName(TranslationsDictExercisesDto translationsDictExercisesDto){
    DictExercisesEntity basicEntity = dictExercisesRepository.findById(translationsDictExercisesDto.id())
        .orElseThrow(() -> new RuntimeException("Entity not found"));
    var perUserEntity = basicEntity.getDictExercisesPerUserEntity();
    perUserEntity.setName(translationsDictExercisesDto.name());
    dictExercisesPerUserRepository.save(perUserEntity);
  }
}
