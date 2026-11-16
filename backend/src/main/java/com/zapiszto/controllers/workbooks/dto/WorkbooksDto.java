package com.zapiszto.controllers.workbooks.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

public record WorkbooksDto (
  int id,
  String name,
  int order_number,
  String insert_date,
  String dict_workbook_schema_name
) {}
