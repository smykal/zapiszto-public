package com.zapiszto.controllers.bodyPhotos.bodyPhotosTags.dto;

import java.util.UUID;

public record TagDto(
    UUID tagId,
    String name
) {
}
