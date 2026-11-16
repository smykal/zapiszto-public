package com.zapiszto.controllers.bodyParams.service;

import com.zapiszto.controllers.bodyParams.dto.BmrCategory;
import com.zapiszto.controllers.bodyParams.dto.BmrDto;
import com.zapiszto.controllers.bodyParams.repository.BmrRepository;
import com.zapiszto.controllers.dictionaries.dictLanguages.options.Languages;
import com.zapiszto.controllers.userDetails.repository.UserDetailsRepository;
import com.zapiszto.utilities.encryption.EncryptionUtil;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@AllArgsConstructor
public class BmrService {

  @Autowired
  BmrRepository bmrRepository;

  @Autowired
  UserDetailsRepository userDetailsRepository;

  @Autowired
  private EncryptionUtil encryptionUtil;

  public List<BmrDto> getBmrByUserId(Long userId) {
    String bmrData = bmrRepository.getBmrData(userId);
    String[] bmrDataTable = bmrData.split(",");
    List<BmrDto> bmrDtos = new ArrayList<>();
    Languages lang = userDetailsRepository.userLanguage(userId);


    double CONST = getConstForUser(userId);

    for (BmrCategory category : BmrCategory.values()) {
      String[] insert_date = bmrDataTable[1].split(" ");
      var weightString = encryptionUtil.decrypt(bmrDataTable[3]);
      var heightString = encryptionUtil.decrypt(bmrDataTable[4]);
      double weight = Double.parseDouble(weightString);
      double height = Double.parseDouble(heightString);
      double age = Double.parseDouble(bmrDataTable[2]);
      double bmr = countBMR(
          CONST,
          weight,
          height,
          age
      ) * category.getActivityCoefficient();

      String categoryDescription = getCategoryDescription(category, lang);

      BmrDto bmrDto = BmrDto.builder()
          .userId(userId)
          .insert_date(insert_date[0])
          .bmr((int) Math.round(bmr))
          .category(categoryDescription)
          .build();

      bmrDtos.add(bmrDto);
    }
    return bmrDtos;
  }

  private String getCategoryDescription(BmrCategory category, Languages lang) {
    return switch (lang) {
      case en -> category.getDescriptionEN();
      case es -> category.getDescriptionES();
      case it -> category.getDescriptionIT();
      case pl -> category.getDescriptionPL();
      case ru -> category.getDescriptionRU();
      case ua -> category.getDescriptionUA();
    };
  }

  private double countBMR(
      double CONST,
      double weight,
      double height,
      double age
  ) {
    return 10 * weight + 6.25 * height - 5 * age + CONST;
  }

  private double getConstForUser(Long userId) {
    String genderByUserId = userDetailsRepository.findGenderByUserId(userId);
    return genderByUserId.equalsIgnoreCase("Female") ? -161 : 5;
  }
}
