package com.zapiszto.controllers.card.card_photos.controller;

import com.zapiszto.controllers.card.card_photos.dto.CardPhotoDto;
import com.zapiszto.controllers.card.card_photos.service.CardPhotosService;
import com.zapiszto.utilities.aws.AwsS3Service;
import java.util.List;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
@RestController
@RequestMapping("/v1")
@PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN') or hasRole('TRAINER')")
public class CardPhotosController {

  @Autowired
  AwsS3Service awsS3Service;

  @Autowired
  CardPhotosService cardPhotosService;

  @GetMapping("/cardPhotos/{cardId}")
  public ResponseEntity<List<CardPhotoDto>> getCardPhotos(@PathVariable("cardId") UUID cardId) {
    var result = cardPhotosService.getPhotoUrls(cardId);
    return new ResponseEntity<>(result, HttpStatus.OK);
  }

  @PostMapping("/upload-photo/{cardId}")
  public ResponseEntity<String> uploadPhoto(
      @RequestParam("file") MultipartFile file,
      @PathVariable("cardId") UUID cardId) {
    cardPhotosService.uploadFile(file, cardId);
    return new ResponseEntity<> (HttpStatus.OK);
  }

  @DeleteMapping("/delete-photo/{cardId}")
  public ResponseEntity<String> deletePhoto(
      @PathVariable("cardId") UUID cardId,
      @RequestBody UUID photoId
  ) {
    cardPhotosService.deletePhoto(cardId, photoId);
    return ResponseEntity.ok("Photo deleted successfully");
  }
}
