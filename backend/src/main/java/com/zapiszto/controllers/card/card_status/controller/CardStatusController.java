package com.zapiszto.controllers.card.card_status.controller;

import com.zapiszto.controllers.card.card_status.dto.CardStatusDto;
import com.zapiszto.controllers.card.card_status.service.CardStatusService;
import com.zapiszto.controllers.common.ControllerCommon;
import com.zapiszto.controllers.dictionaries.dictCardStatus.dto.DictCardStatusDto;
import java.util.List;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
@RestController
@RequestMapping("/v1")
@PreAuthorize("hasRole('ADMIN') or hasRole('TRAINER')")
public class CardStatusController implements ControllerCommon {

  @Autowired
  CardStatusService cardStatusService;

  @GetMapping("/cardStatusActual/{cardId}")
  public ResponseEntity<CardStatusDto> getCardStatusActual(
      @PathVariable("cardId") UUID cardId
  ) {
    var userId = extractUserId();
      var result = cardStatusService.getCardStatusActual(userId, cardId);
      return new ResponseEntity<>(result, HttpStatus.OK);
  }

  @GetMapping("/cardStatus/{cardId}")
  public ResponseEntity<List<DictCardStatusDto>> getCardStatusesAllowedToDo(
      @PathVariable("cardId") UUID cardId
  ) {
    var role = extractUserRole();
    var userId = extractUserId();
    var result = cardStatusService.getCardStatusesAllowedToDo(role, userId, cardId);

    return new ResponseEntity<>(result, HttpStatus.OK);
  }

  @PostMapping("/cardStatus")
  public ResponseEntity<String> postCardStatus(
  @RequestBody CardStatusDto cardStatusDto
  ) {
    var userId = extractUserId();
    try {
      cardStatusService.updateStatus(cardStatusDto, userId);
      return new ResponseEntity<>(null, HttpStatus.OK);
    } catch (NullPointerException e) {
      return new ResponseEntity<>(null, HttpStatus.CONFLICT);
    }
  }
}
