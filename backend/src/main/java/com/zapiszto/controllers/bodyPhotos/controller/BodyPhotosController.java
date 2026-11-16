package com.zapiszto.controllers.bodyPhotos.controller;

import com.zapiszto.controllers.bodyPhotos.dto.BodyPhotoDeleteDto;
import com.zapiszto.controllers.bodyPhotos.dto.BodyPhotoDto;
import com.zapiszto.controllers.bodyPhotos.dto.BodyPhotoEditDateDto;
import com.zapiszto.controllers.bodyPhotos.service.BodyPhotosService;
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
import org.springframework.web.bind.annotation.PatchMapping;
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
@PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN') or hasRole('TRAINER') or hasRole('USER')")
public class BodyPhotosController implements ControllerCommon {

  @Autowired
  BodyPhotosService bodyPhotosService;

  @GetMapping("/bodyPhotos")
  public ResponseEntity<List<BodyPhotoDto>> getBodyPhotos(
      @RequestParam(required = false) UUID clientId
  ) {
    var requestedBy = extractUserId();
    var role = extractUserRole();
    var result = bodyPhotosService.getPhotos(role, clientId, requestedBy);
    return new ResponseEntity<>(result, HttpStatus.OK);
  }

  @PostMapping("/upload-body-photo")
  public ResponseEntity<String> uploadPhoto(
      @RequestParam("file") MultipartFile file,
      @RequestParam(required = false) UUID clientId
  ) {
    var userId = extractUserId();
    var role = extractUserRole();
    bodyPhotosService.uploadFile(file, userId, clientId, role);
    return new ResponseEntity<>(HttpStatus.OK);
  }

  @PatchMapping("/bodyPhotosEditDate/")
  public ResponseEntity<String> editPhotoDate(
      @RequestBody BodyPhotoEditDateDto bodyPhotoEditDateDto
      ) {
    bodyPhotosService.editPhotoDate(bodyPhotoEditDateDto);
    return ResponseEntity.ok("Photo date edit successfully");
  }

  @DeleteMapping("/delete-body-photo")
  public ResponseEntity<String> deletePhoto(
      @RequestBody BodyPhotoDeleteDto bodyPhotoDeleteDto) {
    var role = extractUserRole();
    var userId = extractUserId();
    bodyPhotosService.deleteBodyPhoto(role, bodyPhotoDeleteDto, userId);
    return ResponseEntity.ok("Photo deleted successfully");
  }
}
