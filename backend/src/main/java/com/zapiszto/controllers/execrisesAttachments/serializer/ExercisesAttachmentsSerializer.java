package com.zapiszto.controllers.execrisesAttachments.serializer;

import com.zapiszto.controllers.execrisesAttachments.dto.ExerciseAttachmentDto;
import com.zapiszto.controllers.execrisesAttachments.entity.ExerciseAttachmentEntity;
import com.zapiszto.utilities.aws.CloudFrontSignerService;
import java.time.LocalDate;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ExercisesAttachmentsSerializer {

  @Autowired
  CloudFrontSignerService cloudFrontSignerService;

  public ExerciseAttachmentDto convert(ExerciseAttachmentEntity entity) {
    var url = entity.getFolder() + entity.getName();
    return new ExerciseAttachmentDto(entity.getId(),
        cloudFrontSignerService.sign(url),
        entity.getExtension(),
        entity.getCreateDate().toLocalDate());
  }

  public List<ExerciseAttachmentDto> convert(List<ExerciseAttachmentEntity> entities) {
    return entities.stream().map(this::convert).toList();
  }
}
