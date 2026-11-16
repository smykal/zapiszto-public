package com.zapiszto.controllers.bodyPhotos.bodyPhotosTags.entity;

import com.zapiszto.controllers.bodyPhotos.entity.BodyPhotoEntity;
import com.zapiszto.controllers.dictionaries.dictTags.entity.DictTagsEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "body_photos_tags",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_body_photos_tags_unique",
        columnNames = {"body_photo_id", "dict_tags_id"}
    )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BodyPhotoTagEntity {

  @Id
  @Column(name = "id", nullable = false)
  UUID id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "body_photo_id",  referencedColumnName = "id")
  BodyPhotoEntity bodyPhoto;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "dict_tags_id",   referencedColumnName = "id")
  DictTagsEntity dictTag;
}