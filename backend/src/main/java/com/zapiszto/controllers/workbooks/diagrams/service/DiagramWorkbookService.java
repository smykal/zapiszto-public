package com.zapiszto.controllers.workbooks.diagrams.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;
import com.zapiszto.controllers.userDetails.repository.UserDetailsRepository;
import com.zapiszto.controllers.workbooks.diagrams.dto.TimeMaxTimeAvgTimeForEachExerciseEachTraining;
import com.zapiszto.controllers.workbooks.diagrams.dto.TrainingFrequencyDto;
import com.zapiszto.controllers.workbooks.diagrams.dto.VolumeMaxVolumeAvgVolumeForEachExerciseEachTraining;
import com.zapiszto.controllers.workbooks.diagrams.dto.VolumeSetsRepsForEachDateInCategoryDto;
import com.zapiszto.controllers.workbooks.diagrams.repository.DiagramWorkbookRepository;
import com.zapiszto.utilities.translator.Translations;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DiagramWorkbookService extends Translations {

  @Autowired
  DiagramWorkbookRepository diagramRepository;

  @Autowired
  UserDetailsRepository userDetailsRepository;




  public List<TrainingFrequencyDto> getTrainingFrequency(Long userId, int workbookId) {
    var trainingFrequencyObject = diagramRepository.getTrainingDays(userId, workbookId);

    return trainingFrequencyObject.stream()
        .map(obj -> {
          String dateStr = (String) obj[0];
          Long countLong = (Long) obj[1];

          // Parsujemy String na java.util.Date
          Date date = java.sql.Date.valueOf(dateStr); // yyyy-MM-dd

          return new TrainingFrequencyDto(date, countLong.intValue());
        })
        .toList();
  }

  public List<VolumeSetsRepsForEachDateInCategoryDto> getVolumeSetsRepsForEachDateInCategory(Long userId, int workbookId) {
    var userLanguage = userDetailsRepository.userLanguage(userId);
    var result = diagramRepository.getVolumeSetsRepsForEachDateInCategory(userId, workbookId);

    ObjectReader reader = new ObjectMapper().readerFor(Map.class);

    return result.stream().map(obj -> {
      String dateStr = (String) obj[0];
      String categoryJsonString = (String) obj[1];
      Long sets = (Long) obj[2];
      String repetitions = String.valueOf( obj[3]);
      Double volume = (Double) obj[4];

      // Parsujemy String na java.util.Date
      Date trainingWeek = java.sql.Date.valueOf(dateStr); // yyyy-MM-dd

      //wybieramy język
          String category = null;
          try {
            category = translate(reader.readValue(categoryJsonString), userLanguage);
          } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
          }
          return new VolumeSetsRepsForEachDateInCategoryDto(trainingWeek, category, sets, repetitions, volume);
    })
        .toList();
  }
  public List<VolumeMaxVolumeAvgVolumeForEachExerciseEachTraining> getVolumeMaxVolumeAvgVolumeForEachExerciseEachTraining(Long userId, int workbookId) {
    var userLanguage = userDetailsRepository.userLanguage(userId);
    var result = diagramRepository.getVolumeMaxVolumeAvgVolumeForEachExerciseEachTraining(userId, workbookId);

    ObjectReader reader = new ObjectMapper().readerFor(Map.class);
    Map<String, Float> maxValues = new HashMap<>();

    return result.stream().map(obj -> {
          String categoryJsonString = (String) obj[0];
          String exerciseJsonString = (String) obj[1];
          String dateStr = (String) obj[2];
          Float volumeCol01 = (Float) obj[3];
          Float volumeCol02 = (Float) obj[4];
          Float volumeCol03 = (Float) obj[5];
          Float volumeCol04 = (Float) obj[6];
          Float volumeCol05 = (Float) obj[7];
          Float volumeAvg = (Float) obj[8];
          Float volumeMax = (Float) obj[9];

          // Parsujemy String na java.util.Date
          Date date = java.sql.Date.valueOf(dateStr); // yyyy-MM-dd

          //wybieramy język
          String category;
          String exercise;
          try {
            category = translate(reader.readValue(categoryJsonString), userLanguage);
            exercise = translate(reader.readValue(exerciseJsonString), userLanguage);
          } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
          }

          // Ustawiamy maxa dla ćwiczenia
          Float currentMax = maxValues.getOrDefault(exercise, 0f);
          maxValues.put(
              exercise,
              Math.max(currentMax, volumeMax)
          );


          return new VolumeMaxVolumeAvgVolumeForEachExerciseEachTraining(
              category,
              exercise,
              date,
              volumeCol01,
              volumeCol02,
              volumeCol03,
              volumeCol04,
              volumeCol05,
              volumeAvg,
              maxValues.get(exercise));
        })
        .toList();
  }

  public List<TimeMaxTimeAvgTimeForEachExerciseEachTraining> getTimeMaxTimeAvgTimeForEachExerciseEachTraining(Long userId, int workbookId) {
    var userLanguage = userDetailsRepository.userLanguage(userId);
    var result = diagramRepository.getTimeMaxTimeAvgTimeForEachExerciseEachTraining(userId, workbookId);

    ObjectReader reader = new ObjectMapper().readerFor(Map.class);
    Map<String, Float> maxValues = new HashMap<>();

    return result.stream().map(obj -> {
          String categoryJsonString = (String) obj[0];
          String exerciseJsonString = (String) obj[1];
          String dateStr = (String) obj[2];
          Float timeCol01 = (Float) obj[3];
          Float timeCol02 = (Float) obj[4];
          Float timeCol03 = (Float) obj[5];
          Float timeCol04 = (Float) obj[6];
          Float timeCol05 = (Float) obj[7];
          Float timeAvg = (Float) obj[8];
          Float timeMax = (Float) obj[9];

          // Parsujemy String na java.util.Date
          Date date = java.sql.Date.valueOf(dateStr); // yyyy-MM-dd

          //wybieramy język
          String category;
          String exercise;
          try {
            category = translate(reader.readValue(categoryJsonString), userLanguage);
            exercise = translate(reader.readValue(exerciseJsonString), userLanguage);
          } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
          }

          // Ustawiamy maxa dla ćwiczenia
          Float currentMax = maxValues.getOrDefault(exercise, 0f);
          maxValues.put(
              exercise,
              Math.max(currentMax, timeMax)
          );


          return new TimeMaxTimeAvgTimeForEachExerciseEachTraining(
              category,
              exercise,
              date,
              timeCol01,
              timeCol02,
              timeCol03,
              timeCol04,
              timeCol05,
              timeAvg,
              maxValues.get(exercise));
        })
        .toList();
  }
}
