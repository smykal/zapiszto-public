package com.zapiszto.controllers.dictionaries.dictQuantityType.dictQuantityTypeBasic.repository;

import com.zapiszto.controllers.dictionaries.dictQuantityType.dictQuantityTypeBasic.entity.DictQuantityTypeBasicEntity;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DictQuantityTypeBasicRepository extends JpaRepository<DictQuantityTypeBasicEntity, UUID> {
}
