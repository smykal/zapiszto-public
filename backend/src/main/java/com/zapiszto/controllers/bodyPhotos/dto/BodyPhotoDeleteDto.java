package com.zapiszto.controllers.bodyPhotos.dto;

import java.util.UUID;

public record BodyPhotoDeleteDto(
    UUID photoId,
    String photoUrl,
    Long userId,
    UUID clientId
) {
}
