package com.zapiszto.controllers.execrisesAttachments.dto;

import java.time.LocalDate;
import java.util.UUID;

public record ExerciseAttachmentDto(UUID id,
                                    String photoUrl,
                                    String extension,
                                    LocalDate date)  {
}
