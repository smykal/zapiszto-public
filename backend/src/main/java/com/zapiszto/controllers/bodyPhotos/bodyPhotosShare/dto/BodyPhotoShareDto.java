package com.zapiszto.controllers.bodyPhotos.bodyPhotosShare.dto;

import java.util.UUID;

public record BodyPhotoShareDto(
    UUID bodyPhotoShareId,
    Long userId,
    String name
) {
}
