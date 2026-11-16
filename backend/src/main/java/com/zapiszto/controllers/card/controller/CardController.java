package com.zapiszto.controllers.card.controller;

import com.zapiszto.controllers.card.dto.CardDto;
import com.zapiszto.controllers.card.dto.CardViewDto;
import com.zapiszto.controllers.card.service.CardService;
import com.zapiszto.controllers.common.ControllerCommon;
import jakarta.persistence.EntityNotFoundException;
import java.util.Map;
import javax.smartcardio.Card;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
public class CardController implements ControllerCommon {

  @Autowired
  CardService cardService;

  @GetMapping("/viewCard")
  public ResponseEntity<CardViewDto> viewCard() {

    var userId = extractUserId();
    try {
      var result = cardService.viewCard(userId);
      return new ResponseEntity<>(result, HttpStatus.OK);
    } catch (EntityNotFoundException e) {
      return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }

  }

  @GetMapping("/card/set_up_card")
  public ResponseEntity<CardDto> setUpCard() {
    var userId = extractUserId();
    return ResponseEntity.ok(cardService.setUpCard(userId));
  }

  @GetMapping("/card")
  public ResponseEntity<CardDto> getCardsByUser() {
    var userId = extractUserId();
    return cardService.getCardByUserId(userId)
        .map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.notFound().build());
  }

  @PreAuthorize("permitAll()")
  @GetMapping("/viewCards")
  public ResponseEntity<List<CardViewDto>> getCardsRange(
      @RequestParam(defaultValue = "0") int from,
      @RequestParam(defaultValue = "10") int to
  ) {
    var role = extractUserRole();
    var result = cardService.getCardsRange(from, to, role);
    return new ResponseEntity<>(result, HttpStatus.OK);
  }

  @GetMapping("/{cardId}")
  public ResponseEntity<CardDto> getCardById(@PathVariable UUID cardId) {
    var card = cardService.getCardById(cardId);
    if (card == null) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(card);
  }

  @PostMapping("/new_card")
  public ResponseEntity<String> createCard(@RequestBody CardDto cardDto) {
    var userId = extractUserId();
    cardService.createCard(cardDto, userId);
    return new ResponseEntity<>("Card created successfully", HttpStatus.CREATED);
  }

  @PatchMapping("/card/{cardId}")
  public ResponseEntity<CardDto> patchCard(
      @PathVariable UUID cardId,
      @RequestBody CardDto updatedFields
  ) {
    var userId = extractUserId();
    var updatedCard = cardService.patchCard(cardId, userId, updatedFields);
    return ResponseEntity.ok(updatedCard);
  }
}
