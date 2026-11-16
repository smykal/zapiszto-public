package com.zapiszto.controllers.bodyPhotos.bodyPhotosTags.controller;

import com.zapiszto.controllers.bodyPhotos.bodyPhotosTags.dto.BodyPhotoTagsDto;
import com.zapiszto.controllers.bodyPhotos.bodyPhotosTags.dto.TagDto;
import com.zapiszto.controllers.bodyPhotos.bodyPhotosTags.service.BodyPhotosTagsService;
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
@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')  or hasRole('TRAINER')")
public class BodyPhotosTagsController implements ControllerCommon {

  @Autowired
  BodyPhotosTagsService bodyPhotosTagsService;

  @GetMapping("/body_photos_tags/{photoId}")
  public ResponseEntity<BodyPhotoTagsDto> getBodyPhotoTags(
      @PathVariable("photoId") UUID photoId
  ) {
    var userId = extractUserId();
    var result = bodyPhotosTagsService.getBodyPhotoTags(userId, photoId);
    return new ResponseEntity<>(result, HttpStatus.OK);
  }

  @PostMapping("/body_photo_tags/{photoId}")
  public ResponseEntity<String> addBodyPhotoTags(
      @PathVariable("photoId") UUID photoId,
      @RequestBody List<TagDto> tagsDto) {
    bodyPhotosTagsService.addBodyPhotoTags(photoId, tagsDto);
    return new ResponseEntity<>(HttpStatus.CREATED);
  }

  @DeleteMapping("/body_photo_tag/{photoId}/{tagId}")
  public ResponseEntity<String> deleteBodyPhotoTag(
      @PathVariable("photoId") UUID photoId,
      @PathVariable("tagId") UUID tagId
  ) {
    bodyPhotosTagsService.deleteBodyPhotoTag(photoId, tagId);
    return new ResponseEntity<>(HttpStatus.OK);
  }
}
