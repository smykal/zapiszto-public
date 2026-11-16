package com.zapiszto.controllers.workbooks.diagrams.dto;

import java.util.Date;

public record TimeMaxTimeAvgTimeForEachExerciseEachTraining(String category,
                                                            String exercise,
                                                            Date date,
                                                            Float timeCol01,
                                                            Float timeCol02,
                                                            Float timeCol03,
                                                            Float timeCol04,
                                                            Float timeCol05,
                                                            Float timeAvg,
                                                            Float timeMax) {
}
