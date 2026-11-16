package com.zapiszto.controllers.bodyPhotos.bodyPhotosShare.controller;

import com.zapiszto.controllers.bodyPhotos.bodyPhotosShare.dto.BodyPhotoShareDto;
import com.zapiszto.controllers.bodyPhotos.bodyPhotosShare.service.BodyPhotosShareService;
import com.zapiszto.controllers.bodyPhotos.bodyPhotosTags.dto.TagDto;
import com.zapiszto.controllers.common.ControllerCommon;
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
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
@RestController
@RequestMapping("/v1")
@PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN') or hasRole('TRAINER') or hasRole('USER')")
public class BodyPhotosShareController implements ControllerCommon {

  @Autowired
  BodyPhotosShareService bodyPhotosShareService;

  @GetMapping("/body_photo_share/{bodyPhotoId}")
  public ResponseEntity<List<BodyPhotoShareDto>> getBodyPhotoShare(
      @PathVariable("bodyPhotoId") UUID bodyPhotoId
  ) {
    var userId = extractUserId();
    try {
      var result = bodyPhotosShareService.getBodyPhotoShared(bodyPhotoId);
      return new ResponseEntity<>(result,HttpStatus.OK);
    } catch (Exception e){
      return new ResponseEntity<>(null,HttpStatus.NOT_FOUND);
    }
  }

  @PostMapping("/body_photo_share/{bodyPhotoId}")
  public ResponseEntity<String> addBodyPhotoShares(
      @PathVariable("bodyPhotoId") UUID bodyPhotoId,
      @RequestBody List<Long> shareToUsers) {
    try {
      bodyPhotosShareService.addBodyPhotoShares(bodyPhotoId, shareToUsers);
      return new ResponseEntity<>(HttpStatus.CREATED);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }
  }

  @DeleteMapping("/body_photo_share/{photoId}/{bodyPhotoShareId}")
  public ResponseEntity<String> deleteBodyPhotoShare(
      @PathVariable("photoId") UUID photoId,
      @PathVariable("bodyPhotoShareId") Long bodyPhotoShareId
  ) {
    bodyPhotosShareService.deleteBodyPhotoShare(photoId, bodyPhotoShareId);
    return new ResponseEntity<>(HttpStatus.OK);
  }

}
