package com.zapiszto.controllers.card.card_addresses.controller;

import com.zapiszto.controllers.card.card_addresses.dto.CardAddressDto;
import com.zapiszto.controllers.card.card_addresses.dto.NewCardAddressDto;
import com.zapiszto.controllers.card.card_addresses.service.CardAddressesService;
import com.zapiszto.controllers.common.ControllerCommon;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
@RestController
@RequestMapping("/v1")
@PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN') or hasRole('TRAINER')")
public class CardAddressesController implements ControllerCommon {

  @Autowired
  CardAddressesService cardAddressesService;

  @GetMapping("/cardAddresses/{cardId}")
  public ResponseEntity<List<CardAddressDto>> getAddressesByCard(
      @PathVariable("cardId") UUID cardId
  ) {
    var userId = extractUserId();
    return ResponseEntity.ok(cardAddressesService.getAddressesByCardId(cardId, userId));
  }

  @PostMapping("/cardAddresses")
  public ResponseEntity<CardAddressDto> createAddress(@RequestBody NewCardAddressDto dto) {
    var userId = extractUserId();
    return ResponseEntity.ok(cardAddressesService.createAddress(dto, userId));
  }

  @DeleteMapping("/deleteAddress/{addressId}")
  public ResponseEntity<String> deletePhoto(
      @PathVariable("addressId") UUID addressId
  ) {
    cardAddressesService.deleteAddress(addressId);
    return ResponseEntity.ok("Address deleted successfully");
  }

}
