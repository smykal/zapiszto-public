package com.zapiszto.controllers.dictionaries.dictWorkbookSchema.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

public record DictWorkbookSchemaDto(
    int id,
    String name,
    String description) {}
