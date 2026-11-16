package com.zapiszto.controllers.program.diagrams.service;

import com.zapiszto.controllers.dictionaries.dictLanguages.options.Languages;
import com.zapiszto.controllers.program.diagrams.dto.ExerciseStatsDto;
import com.zapiszto.controllers.program.diagrams.dto.ExerciseStatsForMesocycleDto;
import com.zapiszto.controllers.program.diagrams.repository.DiagramRepository;
import com.zapiszto.controllers.program.mesocycle.entity.MesocycleEntity;
import com.zapiszto.controllers.program.mesocycle.repository.MesocycleRepository;
import com.zapiszto.controllers.userDetails.repository.UserDetailsRepository;
import com.zapiszto.utilities.translator.Translations;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Slf4j
public class DiagramService extends Translations {

  @Autowired
  DiagramRepository diagramRepository;

  @Autowired
  UserDetailsRepository userDetailsRepository;

  @Autowired
  MesocycleRepository mesocycleRepository;

  public List<ExerciseStatsDto> getExerciseStats(UUID mesocycleId, Long userId) {
    Languages lang = userDetailsRepository.userLanguage(userId);
    List<Object[]> diagram = diagramRepository.getExerciseStatsByMesocycleId(mesocycleId, lang.toString());

    if (diagram.isEmpty()) {
      return Collections.emptyList();  // Zwracaj pustą listę zamiast singletonList
    }

    return diagram.stream()
        .map(result ->
            new ExerciseStatsDto(
                ((Number) result[0]).intValue(), // order id
                (String) result[1],             // category
                ((Number) result[2]).intValue(), // repetitions
                ((Number) result[3]).intValue()  // sets
            )
        )
        .collect(Collectors.toList());
  }

  public List<ExerciseStatsForMesocycleDto> getExerciseStatsByProgramId(UUID programId, Long userId) {
    var mesocyclesList = mesocycleRepository.getMesocyclesForProgram(programId);
    List<ExerciseStatsForMesocycleDto> result = new ArrayList<>();

    for (MesocycleEntity mesocycleEntity : mesocyclesList) {
      var exerciseStats = getExerciseStats(mesocycleEntity.getId(), userId);
      result.add(new ExerciseStatsForMesocycleDto(
          mesocycleEntity.getId(),
          mesocycleEntity.getLabel(),
          mesocycleEntity.getOrderId(),
          exerciseStats
      ));
    }

    return result;
  }
}
