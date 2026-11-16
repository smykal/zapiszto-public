package com.zapiszto.controllers.dictionaries.dictTags.dictTagsCategory.repository;

import com.zapiszto.controllers.dictionaries.dictTags.dictTagsCategory.entity.DictTagsCategoryEntity;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DictTagsCategoryRepository extends JpaRepository<DictTagsCategoryEntity, UUID> {
}
