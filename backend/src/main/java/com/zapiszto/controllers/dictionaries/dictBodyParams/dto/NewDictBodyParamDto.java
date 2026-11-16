package com.zapiszto.controllers.dictionaries.dictBodyParams.dto;

import java.util.HashMap;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public record NewDictBodyParamDto(
    HashMap<String, String> name,
    HashMap<String, String> description
) {}
