package com.zapiszto.controllers.bodyPhotos.bodyPhotosTags.dto;

import java.util.Map;
import java.util.UUID;

public record BodyPhotoTagsDto(
    UUID photoId,
    Map<UUID, String> photoTags
) {
}
