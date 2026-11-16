package com.zapiszto.controllers.dictionaries.dictWorkbookSchema.serializer;

import com.zapiszto.controllers.dictionaries.dictLanguages.options.Languages;
import com.zapiszto.controllers.dictionaries.dictWorkbookSchema.dto.DictWorkbookSchemaDto;
import com.zapiszto.controllers.dictionaries.dictWorkbookSchema.entity.DictWorkbookSchemaEntity;
import com.zapiszto.utilities.translator.Translations;
import org.springframework.stereotype.Component;

@Component
public class DictWorkbookSchemaSerializer extends Translations {

  public static DictWorkbookSchemaDto convert(DictWorkbookSchemaEntity dictWorkbookSchemaEntity, Languages languages) {
    var name = dictWorkbookSchemaEntity.getName();
    var description = dictWorkbookSchemaEntity.getDescription();

    return new DictWorkbookSchemaDto(
        dictWorkbookSchemaEntity.getId(),
        translate(name, languages),
        translate(description, languages)
    );
  }
}
