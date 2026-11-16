package com.zapiszto.controllers.card.card_addresses.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;


public record CardAddressDto(
    UUID id,
    String city,
    String gymName,
    String gymAddress,
    String countryName) {
}

