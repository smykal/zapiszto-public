package com.zapiszto.utilities.aws;

import net.coobird.thumbnailator.Thumbnails;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

/**
 * Klasa konwertująca obrazy (np. PNG, JPG) do zoptymalizowanego JPEG-a.
 * Używa biblioteki Thumbnailator — działa bez rejestracji pluginów i natywnie w Javie 17+.
 */
@Component
public class AwsS3Converter {

  /**
   * Konwertuje obraz do formatu JPEG z kompresją ~85%.
   * @param fileBytes bajty oryginalnego pliku (np. PNG, JPG)
   * @return bajty skompresowanego pliku JPEG
   */
  public byte[] convertToOptimizedJpeg(byte[] fileBytes) {
    try (ByteArrayInputStream input = new ByteArrayInputStream(fileBytes);
         ByteArrayOutputStream output = new ByteArrayOutputStream()) {

      // Skalowanie 1.0 = bez zmiany rozdzielczości
      // Można ustawić mniejsze (np. 0.8) jeśli chcesz też zmniejszyć wymiary
      Thumbnails.of(input)
          .scale(1.0)
          .outputFormat("jpeg")
          .outputQuality(0.85f) // 0.0f (najgorsza) → 1.0f (najlepsza jakość)
          .toOutputStream(output);

      return output.toByteArray();

    } catch (IOException e) {
      throw new RuntimeException("Błąd podczas konwersji obrazu: " + e.getMessage(), e);
    }
  }
}
