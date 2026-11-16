package com.zapiszto.controllers.bodyPhotos.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zapiszto.controllers.account.entity.ERole;
import com.zapiszto.controllers.bodyPhotos.dto.BodyPhotoDeleteDto;
import com.zapiszto.controllers.bodyPhotos.dto.BodyPhotoDto;
import com.zapiszto.controllers.bodyPhotos.dto.BodyPhotoEditDateDto;
import com.zapiszto.controllers.bodyPhotos.entity.BodyPhotoEntity;
import com.zapiszto.controllers.bodyPhotos.repository.BodyPhotoRepository;
import com.zapiszto.controllers.bodyPhotos.serializer.BodyPhotoSerializer;
import com.zapiszto.controllers.clients.service.ClientsService;
import com.zapiszto.controllers.common.AwsCommon;
import com.zapiszto.utilities.aws.AwsS3Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@Slf4j
public class BodyPhotosService implements AwsCommon {

  @Value("${aws.s3.bucket-body-photos}")
  private String bucketName;

  @Autowired
  AwsS3Service awsS3Service;

  @Autowired
  BodyPhotoRepository bodyPhotoRepository;

  @Autowired
  BodyPhotoSerializer bodyPhotoSerializer;

  @Autowired
  ClientsService clientsService;

  public void uploadFile(MultipartFile file, Long userId, UUID clientId, ERole role ) {

    var aws = awsS3Service.uploadPhotoToAWS(file, bucketName, FOLDER_BODY_PHOTOS);
    var orderNumber = bodyPhotoRepository.getOrderNumber(userId);
    var bodyPhoto = BodyPhotoEntity.builder()
        .userId(userId)
        .createdBy(userId)
        .date(LocalDate.now())
        .photoName(aws.fileName())
        .photoFolder(aws.folderName())
        .bytes(file.getSize())
        .orderNumber(orderNumber)
        .uploadDate(LocalDateTime.now())
        .build();

    if (role.equals(ERole.ROLE_TRAINER)) {
      var assignedUser = clientsService.getClient(clientId).userId();
      bodyPhoto.setUserId(assignedUser);
      bodyPhoto.setClientId(clientId);
    }

    bodyPhotoRepository.save(bodyPhoto);
  }

  public void deleteBodyPhoto(ERole role,
                              BodyPhotoDeleteDto bodyPhotoDeleteDto,
                              Long userId) {

    var photoId = bodyPhotoDeleteDto.photoId();
    var photoEntity = bodyPhotoRepository.getReferenceById(photoId);
    var photoPath = photoEntity.getPhotoFolder() + photoEntity.getPhotoName();

    deletePhotos(photoId, photoPath);
    Long targetUserId;

    if (bodyPhotoDeleteDto.clientId() == null) {
      targetUserId = userId;
    } else {
      targetUserId = clientsService
          .getClient(bodyPhotoDeleteDto.clientId())
          .userId();
    }

    reorderPhotos(targetUserId);
  }

  @Transactional
  public void deletePhotos(UUID photoId, String photoPath) {
    awsS3Service.deleteFileFromAWS(photoPath, bucketName);
    bodyPhotoRepository.deleteByPhotoId(photoId);
  }

  private void reorderPhotos(Long userId) {
    List<BodyPhotoEntity> photos = bodyPhotoRepository.getBodyPhotosByUserIdOrderByOrderNumberDesc(userId);

    for (int i = 0; i < photos.size(); i++) {
      photos.get(i)
          .setOrderNumber(i + 1);
    }

    bodyPhotoRepository.saveAll(photos);
  }

  public List<BodyPhotoDto> getPhotos(ERole role, UUID clientId, Long requestedBy)  {
    List<BodyPhotoEntity> photos;

    if (role.equals(ERole.ROLE_USER)) {
      photos = bodyPhotoRepository.getBodyPhotosForUser(requestedBy);
      log.info("getPhotos(ERole role, UUID clientId, Long requestedBy) - role user");

    } else {
      photos = bodyPhotoRepository.getBodyPhotosForTrainer(clientId, requestedBy);
      log.info("getPhotos(ERole role, UUID clientId, Long requestedBy) - role other than user");

    }

      for (int i = 0; i < photos.size(); i++) {
        log.info(photos.get(i).getPhotoFolder() + " " + photos.get(i).getPhotoName());
      }

    return bodyPhotoSerializer.convert(photos);
  }

  public void editPhotoDate(BodyPhotoEditDateDto bodyPhotoEditDateDto) {
    var photoEntity = bodyPhotoRepository.getReferenceById(bodyPhotoEditDateDto.id());
    photoEntity.setDate(bodyPhotoEditDateDto.date());

    bodyPhotoRepository.save(photoEntity);
  }
}
