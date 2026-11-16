package com.zapiszto.controllers.bodyPhotos.bodyPhotosTags.dto;

import java.util.UUID;

public record BodyPhotoTagDto(
    UUID photoId,
    TagDto tag
) {
}
