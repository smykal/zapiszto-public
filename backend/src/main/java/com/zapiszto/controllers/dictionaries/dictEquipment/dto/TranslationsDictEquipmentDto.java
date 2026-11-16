package com.zapiszto.controllers.dictionaries.dictEquipment.dto;

import java.util.HashMap;
import java.util.UUID;

public record TranslationsDictEquipmentDto(
    UUID id,
    HashMap<String, String> name
    ) {
}
