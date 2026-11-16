package com.zapiszto.controllers.card.card_status.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "card_status")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CardStatusEntity {

  @Id
  @GeneratedValue
  private UUID id;

  @Column(name = "card_id", nullable = false)
  private UUID cardId;

  @Column(name = "datetime", nullable = false)
  private LocalDateTime datetime;

  @Column(name = "dict_card_status_id", nullable = false)
  private UUID dictCardStatusId;

  @Column(name = "comment", length = 300)
  private String comment;

  @PrePersist
  public void prePersist() {
    if (datetime == null) {
      datetime = LocalDateTime.now();
    }
  }
}
