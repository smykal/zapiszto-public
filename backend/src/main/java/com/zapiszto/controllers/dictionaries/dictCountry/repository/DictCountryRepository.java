package com.zapiszto.controllers.dictionaries.dictCountry.repository;

import com.zapiszto.controllers.dictionaries.dictCountry.entity.DictCountryEntity;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DictCountryRepository extends JpaRepository<DictCountryEntity, UUID> {
}
