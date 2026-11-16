package com.zapiszto.controllers.card.card_photos.entity;


import com.zapiszto.controllers.card.entity.CardEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.util.UUID;

@Entity
@Table(name = "card_photos", schema = "public")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CardPhotoEntity {

  @Id
  @GeneratedValue(generator = "UUID")
  @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
  @Column(name = "id", updatable = false, nullable = false)
  private UUID id;

  // Powiązanie z encją Card (FK)
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "card_id", nullable = false, foreignKey = @ForeignKey(name = "fk_card_photos_card"))
  private CardEntity card;

  @Column(name = "photo_name", length = 200, nullable = false)
  private String photoName;

  @Column(name = "photo_folder", length = 200)
  private String photoFolder;

  @Column(name = "order_number")
  private Integer orderNumber;

  @Column(name = "bytes")
  private Long bytes;
}
