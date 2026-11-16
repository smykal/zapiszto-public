package com.zapiszto.controllers.dictionaries.dictCountry.dto;

import java.util.UUID;

public record DictCountryDto(
    UUID id,
    String name,
    String code
) {
}
