package com.zapiszto.controllers.card.card_photos.service;

import com.zapiszto.controllers.card.card_photos.dto.CardPhotoDto;
import com.zapiszto.controllers.card.card_photos.entity.CardPhotoEntity;
import com.zapiszto.controllers.card.card_photos.repository.CardPhotoRepository;
import com.zapiszto.controllers.card.card_photos.serializer.CardPhotoSerializer;
import com.zapiszto.controllers.card.card_status.entity.CardStatusEntity;
import com.zapiszto.controllers.card.card_status.repository.CardStatusRepository;
import com.zapiszto.controllers.card.entity.CardEntity;
import com.zapiszto.controllers.card.repository.CardRepository;
import com.zapiszto.controllers.common.AwsCommon;
import com.zapiszto.utilities.aws.AwsS3Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class CardPhotosService implements AwsCommon {

  @Value("${aws.s3.bucket-body-photos}")
  private String bucketName;

  @Autowired
  AwsS3Service awsS3Service;

  @Autowired
  CardRepository cardRepository;

  @Autowired
  CardPhotoRepository cardPhotoRepository;

  @Autowired
  CardStatusRepository cardStatusRepository;

  @Autowired
  CardPhotoSerializer cardPhotoSerializer;



  public void uploadFile(MultipartFile file, UUID cardId) {
    Optional<CardEntity> card = cardRepository.findById(cardId);

    if (card.isPresent()) {
      var aws = awsS3Service.uploadPhotoToAWS(file, bucketName, FOLDER_CARD_PHOTOS);
      var orderNumber = cardPhotoRepository.getOrderNumber(cardId);
      var cardPhoto = CardPhotoEntity.builder()
          .card(card.get())
          .photoName(aws.fileName())
          .photoFolder(aws.folderName())
          .orderNumber(orderNumber)
          .bytes(file.getSize())
          .build();
      var cardEntity = card.get();

      cardEntity.setApproved(false);
      cardRepository.save(cardEntity);

      var cardStatusEntity = CardStatusEntity.builder()
          .cardId(cardId)
          .dictCardStatusId(UUID.fromString("46fadc94-d24b-41f3-a4cb-3f0a6bd9c2d7"))
          .build();
      cardStatusRepository.save(cardStatusEntity);

      cardPhotoRepository.save(cardPhoto);
    }
  }

  public List<CardPhotoDto> getPhotoUrls(UUID cardId) {
    var entityList = cardPhotoRepository.getPhotoPath(cardId);
    return cardPhotoSerializer.convert(entityList);
  }

  public List<CardPhotoDto> getPhotos(UUID cardId) {
    return cardPhotoRepository.findAllByCardIdOrderByOrderNumberAsc(cardId)
        .stream()
        .map(cardPhotoSerializer::convert)
        .collect(Collectors.toList());
  }

  public void deletePhoto(UUID cardId, UUID photoId) {
    var entity = cardPhotoRepository.getReferenceById(photoId);
    deletePhoto(photoId, entity.getPhotoFolder()+entity.getPhotoName());
    reorderPhotos(cardId);
  }

  @Transactional
  public void deletePhoto(UUID photoId, String photoName) {
    awsS3Service.deleteFileFromAWS(photoName, bucketName);
    cardPhotoRepository.deleteById(photoId);
  }

  private void reorderPhotos(UUID cardId) {
    List<CardPhotoEntity> photos = cardPhotoRepository.findAllByCardIdOrderByOrderNumberAsc(cardId);

    for (int i = 0; i < photos.size(); i++) {
      photos.get(i)
          .setOrderNumber(i + 1);
    }
    cardPhotoRepository.saveAll(photos);
  }
}
