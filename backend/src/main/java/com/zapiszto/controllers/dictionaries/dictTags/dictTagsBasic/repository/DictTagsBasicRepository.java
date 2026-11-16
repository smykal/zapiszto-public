package com.zapiszto.controllers.dictionaries.dictTags.dictTagsBasic.repository;

import com.zapiszto.controllers.dictionaries.dictTags.dictTagsBasic.entity.DictTagsBasicEntity;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DictTagsBasicRepository extends JpaRepository<DictTagsBasicEntity, UUID> {
}
