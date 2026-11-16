package com.zapiszto.controllers.dictionaries.dictTags.repository;

import com.zapiszto.controllers.dictionaries.dictExercises.entity.DictExercisesEntity;
import com.zapiszto.controllers.dictionaries.dictTags.entity.DictTagsEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface DictTagsRepository extends JpaRepository<DictTagsEntity, UUID> {

  @Query(nativeQuery = true, value = """
     select *
     from dict_tags
     where dict_tags_category_id = :tagsCategoryId
     """)
  List<DictTagsEntity> getAllByCategoryId(@Param("tagsCategoryId") UUID tagsCategoryId);

  @Query(nativeQuery = true, value = """
      SELECT dt.*
      FROM dict_tags dt
      LEFT JOIN body_photos_tags bpt
        ON dt.id = bpt.dict_tags_id
       AND bpt.body_photo_id = :photoId
      WHERE bpt.dict_tags_id IS NULL;
      """)
  List<DictTagsEntity> findTagsForBodyPhoto(@Param("photoId")UUID photoId);

  @Modifying
  @Transactional
  @Query(nativeQuery = true, value = """
      DELETE FROM public.dict_tags
        WHERE dict_tags_per_user_id = :itemToDelete
           OR dict_tags_basic_id = :itemToDelete
      """)
  void deleteDictTags(
      @Param("itemToDelete") UUID itemToDelete);

  @Modifying
  @Transactional
  @Query(nativeQuery = true, value = """
      DELETE FROM public.dict_tags_per_user
        WHERE id = :itemToDelete
        AND user_id = :userId
      """)
  void deleteDictTagsPerUser(UUID itemToDelete, Long userId);

  @Modifying
  @Transactional
  @Query(nativeQuery = true, value = """
      DELETE FROM public.dict_tags_basic
        WHERE id = :itemToDelete
      """)
  void deleteDictTagsBasic(
      @Param("itemToDelete")UUID itemToDelete);



}
