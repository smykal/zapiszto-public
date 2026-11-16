package com.zapiszto.controllers.dictionaries.dictCardStatus.entity;

import jakarta.persistence.*;
import java.util.HashMap;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import java.util.UUID;
import java.util.Map;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "dict_card_status")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DictCardStatusEntity {

  @Id
  @GeneratedValue
  @Column(name = "id")
  UUID id;

  @JdbcTypeCode(SqlTypes.JSON)
  HashMap<String, String> statusName;
}