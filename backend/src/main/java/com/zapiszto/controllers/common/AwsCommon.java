package com.zapiszto.controllers.common;

public interface AwsCommon {

    String BUCKET = "dev-body-photos";
    String FOLDER_CARD_PHOTOS = "cardPhotos/";
    String FOLDER_BODY_PHOTOS = "bodyPhotos/";
    String FOLDER_EXERCISES_ATTACHMENT_EXERCISE = "exercisesAttachments/exercise/";
    String FOLDER_EXERCISES_ATTACHMENT_DICT_EXERCISE_PER_USER = "exercisesAttachments/dictExercise/dictPerUser/";
    String FOLDER_EXERCISES_ATTACHMENT_DICT_EXERCISE_BASIC = "exercisesAttachments/dictExercise/dictBasic/";

    default String getExtension(String fileName) {
      int dotIndex = fileName.lastIndexOf('.');
      return (dotIndex == -1) ? "" : fileName.substring(dotIndex + 1);
    }
}
