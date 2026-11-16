package com.zapiszto.controllers.dictionaries.dictCategory.repository;

import com.zapiszto.controllers.dictionaries.dictCategory.entity.DictCategoryEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DictCategoryRepository extends JpaRepository<DictCategoryEntity, UUID> {
  @Query(nativeQuery = true, value = """
      select * from ( select 	de.id
                          	,	de.dict_category_basic_id
                          	,	de.dict_category_per_user_id
                          	,	depu.user_id
                          from dict_category de
                          			    left join dict_category_per_user depu on depu.id = de.dict_category_per_user_id
                          			    left join dict_category_basic dcb on dcb.id = de.dict_category_basic_id order by dcb.order_id
                          ) as foo
            where user_id is null or user_id = :userId
      """)
  List<DictCategoryEntity> getAllForUser(@Param("userId") Long userId);

  @Query(nativeQuery = true, value = """
      SELECT
        COUNT(*)
      FROM dict_exercises_per_user depu
      LEFT JOIN dict_category dc ON depu.dict_category_id = dc.id
        WHERE dict_category_per_user_id = :categoryId
      """)
  Long countExercisesForCategory(@Param("categoryId") UUID categoryId);

  @Modifying
  @Query(nativeQuery = true, value = """
      DELETE FROM public.dict_category
        WHERE dict_category_per_user_id = :itemToDelete
      """)
  void deleteDictCategoryPerUser(@Param("itemToDelete") UUID itemToDelete);


  @Modifying
  @Query(nativeQuery = true, value = """
      DELETE FROM public.dict_category_per_user
        WHERE id = :itemToDelete
        AND user_id = :userId
      """)
  void deleteDictCategoryPerUser(@Param("itemToDelete") UUID itemToDelete,
                                 @Param("userId") Long userId);

  @Modifying
  @Query(nativeQuery = true, value = """
      DELETE FROM public.dict_category
        WHERE dict_category_basic_id = :itemToDelete
      """)
  void deleteDictCategoryBasic(@Param("itemToDelete") UUID itemToDelete);


  @Modifying
  @Query(nativeQuery = true, value = """
      DELETE FROM public.dict_category_basic
        WHERE id = :itemToDelete
      """)
  void deleteDictCategory(@Param("itemToDelete") UUID itemToDelete);
}
