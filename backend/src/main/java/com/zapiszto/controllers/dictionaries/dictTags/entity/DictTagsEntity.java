package com.zapiszto.controllers.dictionaries.dictTags.entity;

import com.zapiszto.controllers.dictionaries.dictTags.dictTagsBasic.entity.DictTagsBasicEntity;
import com.zapiszto.controllers.dictionaries.dictTags.dictTagsCategory.entity.DictTagsCategoryEntity;
import com.zapiszto.controllers.dictionaries.dictTags.dictTagsPerUser.entity.DictTagsPerUserEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "dict_tags")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DictTagsEntity {

  @Id
  @Column(name = "id")
  UUID id;

  @ManyToOne
  @JoinColumn(name = "dict_tags_basic_id", referencedColumnName = "id")
  DictTagsBasicEntity dictTagsBasicEntity;

  @ManyToOne
  @JoinColumn(name = "dict_tags_per_user_id", referencedColumnName = "id")
  DictTagsPerUserEntity dictTagsPerUserEntity;

  @ManyToOne
  @JoinColumn(name = "dict_tags_category_id", referencedColumnName = "id")
  DictTagsCategoryEntity dictTagsCategoryEntity;
}
