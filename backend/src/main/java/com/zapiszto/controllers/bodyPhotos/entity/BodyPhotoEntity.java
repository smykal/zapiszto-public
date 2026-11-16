package com.zapiszto.controllers.bodyPhotos.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "body_photos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BodyPhotoEntity {

  @Id
  @GeneratedValue
  @Column(name = "id", updatable = false, nullable = false)
  UUID id;

  @Column(name = "user_id", nullable = false)
  Long userId;

  @Column(name = "created_by", nullable = false)
  Long createdBy;

  @Column(name = "date")
  LocalDate date;

  @Column(name = "photo_name", length = 200, nullable = false)
  String photoName;

  @Column(name = "photo_folder", length = 200)
  String photoFolder;

  @Column(name = "bytes", nullable = false)
  Long bytes;

  @Column(name = "order_number")
  Integer orderNumber;

  @Column(name = "client_id")
  UUID clientId;

  @Column(name = "upload_date")
  LocalDateTime uploadDate;
}
