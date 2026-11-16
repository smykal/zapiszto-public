package com.zapiszto.controllers.card.card_addresses.entity;

import com.zapiszto.controllers.card.entity.CardEntity;
import com.zapiszto.controllers.dictionaries.dictCountry.entity.DictCountryEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
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
@Table(name = "card_addresses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CardAddressEntity {

  @Id
  @GeneratedValue
  @Column(name = "id", updatable = false, nullable = false)
  UUID id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "card_id", nullable = true)
  CardEntity cardId;

  @Column(name = "card_id",insertable = false, updatable = false)
  UUID cardIdUuid;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "dict_country_id", nullable = true)
  DictCountryEntity dictCountry;

  @Column(name = "dict_country_id", insertable = false, updatable = false)
  UUID dictCountryId;

  @Column(name = "city", length = 100)
  String city;

  @Column(name = "gym_name", length = 100)
  String gymName;

  @Column(name = "gym_address", length = 200)
  String gymAddress;
}
