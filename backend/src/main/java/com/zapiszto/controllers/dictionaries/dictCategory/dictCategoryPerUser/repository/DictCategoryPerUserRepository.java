package com.zapiszto.controllers.dictionaries.dictCategory.dictCategoryPerUser.repository;

import com.zapiszto.controllers.dictionaries.dictCategory.dictCategoryPerUser.entity.DictCategoryPerUserEntity;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DictCategoryPerUserRepository extends JpaRepository<DictCategoryPerUserEntity, UUID> {
}
