package com.zapiszto.controllers.dictionaries.dictTags.dictTagsPerUser.repository;

import com.zapiszto.controllers.dictionaries.dictTags.dictTagsPerUser.entity.DictTagsPerUserEntity;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DictTagsPerUserRepository extends JpaRepository<DictTagsPerUserEntity, UUID> {
}
