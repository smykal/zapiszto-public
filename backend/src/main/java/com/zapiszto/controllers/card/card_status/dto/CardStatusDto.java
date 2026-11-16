package com.zapiszto.controllers.card.card_status.dto;

import java.util.UUID;

public record CardStatusDto(
    UUID cardId,
    UUID dictCardStatusId,
    String dictCardStatusName,
    String comment
) {
}
