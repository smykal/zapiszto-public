package com.zapiszto.controllers.dictionaries.dictTags.dictTagsCategory.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "dict_tags_category")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DictTagsCategoryEntity {

  @Id
  @Column(name = "id", nullable = false)
  UUID id;

  @JdbcTypeCode(SqlTypes.JSON)
  @Column(name = "name", columnDefinition = "jsonb", nullable = false)
  HashMap<String, String> name;

}
