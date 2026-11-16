package com.zapiszto.controllers.card.card_addresses.dto;

import java.util.UUID;

public record NewCardAddressDto(
    UUID cardId,
    String gymName,
    String gymAddress,
    String city,
    UUID countryId
) {
}
