package com.zapiszto.controllers.bodyPhotos.bodyPhotosShare.entity;

import com.zapiszto.controllers.account.entity.User;
import com.zapiszto.controllers.bodyPhotos.entity.BodyPhotoEntity;
import com.zapiszto.controllers.dictionaries.dictBodyParams.entity.DictBodyParamsEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
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
@Table(name = "body_photos_share")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BodyPhotosShareEntity {

  @Id
  @Column(name = "id")
  UUID id;

  @ManyToOne
  @JoinColumn(name = "body_photo_id", referencedColumnName = "id")
  BodyPhotoEntity bodyPhotoEntity;

  @ManyToOne
  @JoinColumn(name = "user_id", referencedColumnName = "id")
  User user;
}
