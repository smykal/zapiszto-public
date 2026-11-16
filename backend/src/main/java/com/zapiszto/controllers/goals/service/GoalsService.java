package com.zapiszto.controllers.goals.service;

import com.zapiszto.controllers.goals.dto.GoalDetailsDto;
import com.zapiszto.controllers.goals.dto.GoalDto;
import com.zapiszto.controllers.goals.dto.NewGoalDto;
import com.zapiszto.controllers.goals.dto.UpdateGoalDto;
import com.zapiszto.controllers.goals.entity.GoalEntity;
import com.zapiszto.controllers.goals.repository.GoalsRepository;
import com.zapiszto.controllers.goals.serializer.GoalsSerializer;
import com.zapiszto.controllers.userDetails.repository.UserDetailsRepository;
import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class GoalsService {

  @Autowired
  GoalsRepository goalsRepository;

  @Autowired
  UserDetailsRepository userDetailsRepository;

  public void addGoal(NewGoalDto newGoalDto) {
    GoalEntity goalEntity = GoalEntity.builder()
        .id(newGoalDto.id())
        .clientId(newGoalDto.clientId())
        .dictBodyParamsId(newGoalDto.dictBodyParamId() != null ? newGoalDto.dictBodyParamId() : null)
        .dictBodyTestId(newGoalDto.dictBodyTestId() != null ? newGoalDto.dictBodyTestId() : null)
        .dictUnitsId(newGoalDto.dictUnitId() != null ? newGoalDto.dictUnitId() : null)
        .action(newGoalDto.action())
        .value(newGoalDto.value())
        .goalDate(newGoalDto.goalDate())
        .insertDate(ZonedDateTime.now())
        .build();
    goalsRepository.save(goalEntity);
  }

  public List<GoalDto> getGoals(UUID clientId, Long userId) {
    List<GoalEntity> goalsByClientId = goalsRepository.getGoalsByClientId(clientId);
    var userLanguage = userDetailsRepository.userLanguage(userId);

    return goalsByClientId.stream()
        .map(goal -> GoalsSerializer.convert(goal, userLanguage))
        .collect(Collectors.toList());
  }

  public List<GoalDetailsDto> getGoalDetails(UUID clientId) {
    List<Object[]> goalDetailsByClientId = goalsRepository.findGoalDetailsByClientIdFunction(clientId);

    if (goalDetailsByClientId.isEmpty()) {
      return Collections.singletonList(new GoalDetailsDto(
          clientId,  // Możesz zostawić clientId jako wartość
          "",  // bodyParamName
          "",  // bodyTestName
          "",  // unitName
          "",  // action
          ""   // value
      ));
    }

    return goalDetailsByClientId.stream()
        .map(result ->
            new GoalDetailsDto(
                (UUID) result[0], // clientId
                (String) result[1], // bodyParamName
                (String) result[2], // bodyTestName
                (String) result[3], // unitName
                (String) result[4], // action
                (String) result[5]  // value
            )
        )
        .collect(Collectors.toList());
  }

  @Transactional
  public void deleteGoal(UUID goalId) {
    goalsRepository.deleteById(goalId);
  }

  public void updateGoal(UpdateGoalDto dto, Long trainerId) {
    GoalEntity entity = goalsRepository.findById(dto.id())
        .orElseThrow(() -> new RuntimeException("Goal not found"));

    entity.setAction(dto.action());
    entity.setValue(dto.value());
    entity.setGoalDate(LocalDate.parse(dto.goalDate()));

    goalsRepository.save(entity);
  }
}
