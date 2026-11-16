package com.zapiszto.controllers.card.dto;

import com.zapiszto.controllers.card.card_addresses.dto.CardAddressDto;
import com.zapiszto.controllers.card.card_photos.dto.CardPhotoDto;
import java.util.List;
import java.util.UUID;

public record CardViewDto(UUID id,
                          String title,
                          String description,
                          String experience,
                          String phone,
                          String mail,
                          String instagram,
                          String www,
                          Boolean online,
                          List<CardAddressDto> addresses,
                          List<CardPhotoDto> photos) {
}
