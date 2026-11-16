package com.zapiszto.controllers.workbooks.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

public record PatchWorkbookSchemaDto (
  int id,
  int dict_workbook_schema_id
) {}
