package com.zapiszto.controllers.dictionaries.dictBodyParams.dto;

import java.util.HashMap;

public record TranslationsDictBodyParamsDto(
    Integer id,
    HashMap<String, String> name,
    HashMap<String, String> description
) {
}
