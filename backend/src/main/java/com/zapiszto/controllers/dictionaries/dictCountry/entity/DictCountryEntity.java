package com.zapiszto.controllers.dictionaries.dictCountry.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.HashMap;
import java.util.UUID;

@Entity
@Table(name = "dict_country")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DictCountryEntity {

  @Id
  @GeneratedValue
  @Column(name = "id", updatable = false, nullable = false)
  UUID id;

  @JdbcTypeCode(SqlTypes.JSON)
  @Column(name = "country_name", columnDefinition = "jsonb")
  HashMap<String, String> countryName;

  @JdbcTypeCode(SqlTypes.JSON)
  @Column(name = "country_code", columnDefinition = "jsonb")
  HashMap<String, String> countryCode;
}
