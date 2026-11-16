package com.zapiszto.controllers.bodyPhotos.dto;

import java.time.LocalDate;
import java.util.UUID;

public record BodyPhotoDto(UUID id,
                           String photoUrl,
                           Integer orderNumber,
                           LocalDate date) {}
