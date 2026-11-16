package com.zapiszto.controllers.card.entity;

import com.zapiszto.controllers.account.entity.User;
import com.zapiszto.utilities.encryption.Encrypt;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Entity
@Table(name = "card")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CardEntity {

  @Id
  @GeneratedValue
  @Column(name = "id", updatable = false, nullable = false)
  UUID id;

  @Column(name = "user_id", nullable = false)
  Long userId;

  @Column(name = "title", length = 50)
  String title;

  @Column(name = "description", length = 300)
  String description;

  @Column(name = "experience", length = 300)
  String experience;

  @Column(name = "phone", length = 15)
  @Convert(converter = Encrypt.class)
  String phone;

  @Column(name = "mail", length = 255)
  @Convert(converter = Encrypt.class)
  String mail;

  @Column(name = "instagram", length = 255)
  @Convert(converter = Encrypt.class)
  String instagram;

  @Column(name = "www", length = 255)
  @Convert(converter = Encrypt.class)
  String www;

  @Column(name = "online")
  Boolean online;

  @Column(name = "approved")
  Boolean approved;
}
