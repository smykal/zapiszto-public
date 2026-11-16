package com.zapiszto.controllers.dictionaries.dictCardStatus.dto;

import java.util.UUID;

public record DictCardStatusDto(
    UUID id,
    String statusName
) {
}
