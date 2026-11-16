package com.zapiszto.controllers.card.card_photos.dto;

import java.util.UUID;

public record CardPhotoDto(
    UUID id,
    UUID cardId,
    String photoUrl,
    Integer orderNumber
) {
}
