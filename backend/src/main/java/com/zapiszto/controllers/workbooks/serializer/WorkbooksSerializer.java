package com.zapiszto.controllers.workbooks.serializer;

import com.zapiszto.controllers.dictionaries.dictLanguages.options.Languages;
import com.zapiszto.controllers.dictionaries.dictWorkbookSchema.entity.DictWorkbookSchemaEntity;
import com.zapiszto.controllers.workbooks.dto.AddWorkbookDto;
import com.zapiszto.controllers.workbooks.dto.WorkbooksDto;
import com.zapiszto.controllers.workbooks.entity.WorkbooksEntity;
import com.zapiszto.utilities.translator.Translations;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class WorkbooksSerializer extends Translations {

  public static WorkbooksEntity convert(
      AddWorkbookDto addWorkbookDto,
      Long userId,
      int maxOrderNumber,
      DictWorkbookSchemaEntity dictWorkbookSchemaEntity
  ) {

    return WorkbooksEntity.builder()
        .name(addWorkbookDto.name())
        .orderNumber(maxOrderNumber)
        .userId(userId)
        .insert_date(ZonedDateTime.now())
        .dictWorkbookSchemaId(dictWorkbookSchemaEntity)
        .build();
  }

  public static WorkbooksDto convert(WorkbooksEntity workbooksEntity, Languages language) {
    var name = workbooksEntity.getDictWorkbookSchemaId().getName();
    String zonedDate = workbooksEntity.getInsert_date().toString();
    LocalDateTime date = LocalDateTime.parse(zonedDate.substring(0, zonedDate.indexOf("Z")));

    return new WorkbooksDto(
        workbooksEntity.getId(),
        workbooksEntity.getName(),
        workbooksEntity.getOrderNumber(),
        date.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")),
        translate(name, language)
    );
  }
}
