package com.zapiszto.controllers.bodyPhotos.dto;

import java.time.LocalDate;
import java.util.UUID;

public record BodyPhotoEditDateDto(
    UUID id,
    LocalDate date
) {
}
