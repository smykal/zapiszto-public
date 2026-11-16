package com.zapiszto.utilities.aws;

import java.util.Objects;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

import java.io.IOException;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AwsS3Service {

  private final S3Client s3Client;
  private final AwsS3Converter awsS3Converter;

  //@Value("${aws.s3.bucket-name}")
  //private String bucketName;

  @Value("${aws.s3.region}")
  private String region;

  /**
   * Wysyła plik graficzny na AWS S3 po konwersji do zoptymalizowanego JPEG.
   * @param file przesyłany plik (np. PNG, JPG)
   * @return pełny URL do zapisanego pliku w S3
   */

  public AwsDto uploadPhotoToAWS(MultipartFile file, String bucketName, String folderName) {
    AwsDto aws;
    var filename = file.getOriginalFilename();

    assert filename != null;
    if (filename.contains("webp")) {
      aws = uploadFileRaw(file, bucketName, folderName);
    } else {
      aws = uploadFileToAWSFormatted(file, bucketName, folderName);
    }

    return aws;
  }

  public AwsDto uploadFileToAWSFormatted(MultipartFile file, String bucketName, String folderName) {
    try {
      // Przygotowanie nazwy pliku
      String fileName = Instant.now().toEpochMilli() + "_" + UUID.randomUUID().toString() + ".jpg";
      String filePath = folderName + fileName;

      // Konwersja do zoptymalizowanego JPEG
      byte[] jpegBytes = awsS3Converter.convertToOptimizedJpeg(file.getBytes());

      // Tworzenie zapytania do S3
      PutObjectRequest putObjectRequest = PutObjectRequest.builder()
          .bucket(bucketName)
          .key(filePath)
          .contentType("image/jpeg")
          .build();

      // Wysyłanie do S3
      s3Client.putObject(putObjectRequest, RequestBody.fromBytes(jpegBytes));

      // Generowanie publicznego URL
      return generateFileUrl(fileName, folderName);

    } catch (IOException e) {
      throw new RuntimeException("Błąd podczas odczytu lub konwersji pliku: " + e.getMessage(), e);
    } catch (S3Exception e) {
      throw new RuntimeException("Błąd przesyłania pliku do AWS S3: " + e.awsErrorDetails().errorMessage(), e);
    }
  }

  public AwsDto uploadFileRaw(MultipartFile file, String bucketName, String folderName) {
    try {
      String originalName = file.getOriginalFilename();
      if (originalName == null || originalName.isBlank()) {
        throw new RuntimeException("Nieprawidłowa nazwa pliku");
      }

      String extension = getFileExtension(originalName).toLowerCase();
      String fileName = Instant.now().toEpochMilli() + UUID.randomUUID().toString() + "." + extension;
      String filePath = folderName + fileName;

      PutObjectRequest putObjectRequest = PutObjectRequest.builder()
          .bucket(bucketName)
          .key(filePath)
          .contentType(file.getContentType())
          .build();

      s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));

      return generateFileUrl(fileName, folderName);

    } catch (IOException e) {
      throw new RuntimeException("Błąd podczas wysyłania pliku: " + e.getMessage(), e);
    } catch (S3Exception e) {
      throw new RuntimeException("Błąd przesyłania pliku do AWS S3: " + e.awsErrorDetails().errorMessage(), e);
    }
  }

  public void deleteFileFromAWS(String fileName, String bucketName) {
    try {
      DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
          .bucket(bucketName)
          .key(fileName)
          .build();

      s3Client.deleteObject(deleteObjectRequest);

    } catch (S3Exception e) {
      throw new RuntimeException("Błąd usuwania pliku z AWS S3: " + e.awsErrorDetails().errorMessage(), e);
    }
  }

  private AwsDto generateFileUrl(String fileName, String folderName) {
    return new AwsDto(fileName, folderName);
  }

  private String getFileExtension(String fileName) {
    int dotIndex = fileName.lastIndexOf('.');
    return (dotIndex == -1) ? "" : fileName.substring(dotIndex + 1);
  }
}
