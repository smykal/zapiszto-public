export type BodyParamsItem = {
                              id: number;
                              dict_body_params_name: string;
                              value: number;
                              insert_date: string;
                              createdBy: string;
}

export interface BodyParamDto  {
                                  dict_body_params_id: number
                                  value: string
                                  clientId: string
} 

export type DictBodyParam = {
                              id: number;
                              name: string;
                              description: string;
}

export interface NewDictBodyParam {
                                    name: { [key: string]: string };
                                    description: { [key: string]: string };
}

export interface TranslationsDictBodyParamsDto {
                                    id: number;
                                    name: { [key: string]: string };
                                    description: { [key: string]: string };
}

export type BmiItem = {
                        value: number;
                        date: string;
                        weight: number;
                        description: string;
}

export type BmrType = {
                        userId: number;
                        insert_date: string;
                        bmr: number;
                        category: string;
}

export type CpfType = {
                      activity_level: string;
                      tittle: string;
                      kcalMin: number;
                      kcalMax: number;
                      carbohydrateMin: number;
                      carbohydrateMax: number;
                      proteinMin: number;
                      proteinMax: number;
                      fatMin: number;
                      fatMax: number;
}

export type Workbook = {
                    id: number;
                    name: string;
                    order_number: number
                    insert_date: string
                    dict_workbook_schema_name: string
}

export type WorkbookSchemaIdPut = {
                                  id: number;
                                  dict_workbook_schema_id: number;
}

export type NewWorkbook = {
                            name: string;
}

export type DictWorkbookSchema = {
                                  id: number;
                                  name: string;
                                  description: string;
}

export type NewTraining = {
                            workbook_id: number;
                            date: Date;
}

export type TrainingNotes = {
                             id: number;
                             notes: string 
}

export type TrainingDate = {
                             id: number;
                             date: string;
}

export type Training = {
                        id: number;
                        workbooks_id: number;
                        date: string;
                        notes: string
}

export type DictQuantityType = {
                                id: string;
                                dict: string;
                                dict_id: string;
                                name: string;
                                shortcut: string
}

export interface NewDictQuantityType {
                                      id: string;
                                      name: { [key: string]: string };
                                      shortcut: { [key: string]: string };
                                    }

export interface TranslationsDictQuantityTypeDto {
                                                  id: string;
                                                  name: { [key: string]: string };
                                                  shortcut: { [key: string]: string };
                                                }

export type DictUnits = {
                          id: string
                          dict: string
                          dict_id: string
                          name: string
                          shortcut: string
}

export type NewDictUnit = {
                            id: string
                            name: { [key: string]: string };
                            shortcut: { [key: string]: string };
}

export interface TranslationsDictUnitDto {
                                          id: string;
                                          name: { [key: string]: string };
                                          shortcut: { [key: string]: string };
}

export type NewDictCategory = {
                                id: string,
                                name: { [key: string]: string },
                                description: { [key: string]: string }
}

export type DictCategories = {
                          id: string;
                          dict: string;
                          dict_id: string;
                          name: string;
                          description: string
}

export type DictExercises = {
                              id: string;
                              dict: string;
                              dict_id: string;
                              name: string
                              category_type: string
                              category_id: string
                              category_name: string
                              hasAttachments: boolean
}

export type NewDictExercises = {
                                id: string
                                name: { [key: string]: string };
                                categoryId: string
}

export type TranslationsDictExercisesDto = {
                                            id: string;
                                            name: { [key: string]: string };
}

export type LastExerciseData = {
                                quantity: number,
                                dictQuantityTypeId: string,
                                volume: number,
                                dictUnitId: string
}

export type NewExercise = {
                        id: string;
                        trainingId: number,
                        dictExerciseId: string,
                        quantity: number,
                        dictQuantityTypeId: string,
                        volume: number | null,
                        dictUnitId: string,
                        notes: string
}

export type Exercise = {
                        exerciseId: string,
                        trainingId: number,
                        dictExerciseName: string,
                        quantity: number,
                        dictQuantityTypeName: string,
                        dictQuantityTypeId: string,
                        volume: number,
                        dictUnitName: string,
                        dictUnitId: string,
                        notes: string,
                        orderNumber: number,
                        hasAttachment: boolean
}

export type ExerciseSession = {
                                exerciseId: string;
                                sessionId: string;
                                dictExerciseName: string;
                                dictExerciseId: string;
                                dictCategoryName: string;
                                dictCategoryId: string;
                                quantity: number | null;
                                dictQuantityTypeName: string;
                                dictQuantityTypeId: string;
                                volume: number | null;
                                dictUnitName: string;
                                dictUnitNameId: string;
                                notes: string;
                                orderNumber: number;
                                restTime: number | null;
                                tempo: string | null;
                                dictSessionPartName: string;
                                dictSessionPartId: string | null;
                                sets: number;
                                equipmentName: string | null;
                                dictEquipmentId: string | null;
                                equipmentAttribute: string;
                                weightPerSide: number | null;
                                duration: number | null;
                                executed: boolean | null;
                                hasAttachment: boolean | null;
};

export type NewInvitation = {
                              email: string;
}

export type Invitation = {
                          id: string,
                          inviterId: number,
                          inviterName: string,
                          inviterEmail: string,
                          inviteeId: number,
                          inviteeName: string,
                          inviteeEmail: string,
                          status: string
}

export type AcceptedInvitations = {
                                    acceptedUserId: string,
                                    acceptedUserEmail: string,
                                    acceptedUserName: string
}

export type MatchedInvitations = {
                                    userId: string,
                                    userEmail: string,
                                    userName: string,
                                    matched: boolean,
                                    clientId: string
}


export type UserDetails = {
                            languageCode: string,
                            languageLabel: string
}

export type UserDetailsLanguage = {
                                    languageCode: string
}

export type Client = {
                      id: string,
                      clientName: string,
                      userId: number,
                      userName: string | null
}

export type NewClient = {
                          id: string,
                          clientName: string,
                          userId: number
}

export interface ClientProgramDto {
                                      name: string;
                                      macrocycles: ClientProgramMacrocycleDto[];
}

export interface ClientProgramMacrocycleDto {
                                      id: string;
                                      mesocycles: ClientProgramMesocycleDto[];
}

export interface ClientProgramMesocycleDto {
                                            orderId: number;
                                            microcycles: ClientProgramMicrocycleDto[];
}

export interface ClientProgramMicrocycleDto {
                                            orderId: number;
                                            sessions: ClientProgramSessionDto[];
}

export interface ClientProgramSessionDto {
                                          orderId: number;
                                          exercises: ClientProgramExerciseDto[];
}

export interface ClientProgramExerciseDto {
                                          exerciseId: string;
                                          orderId: number;
                                          purpose: string;
                                          purposeId: string;
                                          category: string;
                                          exercise: string;
                                          dictExerciseId: string;
                                          weight: number;
                                          weightUnit: string;
                                          repetitions: number;
                                          repetitionsUnit: string;
                                          executed: boolean | null;
                                          hasAttachment: boolean | null;
}

export type NewDictBodyTest = {
                                id: string;
                                name: { [key: string]: string };
                                description: { [key: string]: string };
                                purpose: { [key: string]: string };
}

export interface TranslationsDictBodyTestDto {
                                              id: string;
                                              name: { [key: string]: string };
                                              description: { [key: string]: string };
                                              purpose: { [key: string]: string };
}

export type DictBodyTest = {
                            id: string,
                            dict: string,
                            dict_id: string,
                            name: string,
                            description: string,
                            purpose: string
}

export type NewClientBodyTest = {
                            id: string,
                            clientId: string,
                            dictBodyTestId: string,
                            result: string
}

export type ClientBodyTest = {
                              id: string
                              dict_body_test_id: string
                              dict: string
                              dict_id: string
                              name: string
                              result: string
                              description: string
                              purpose: string
}

export type NewGoal = {
                        id: string,
                        clientId: string,
                        dictBodyParamId: string | null,
                        dictBodyTestId: string | null,
                        dictUnitId: string,
                        action: string,
                        value: string,
                        goalDate: string
}

export type Goal = {
                      id: string;
                      clientId: string;
                      goalType: string;
                      dictBodyParamId: string | null;
                      dictBodyParam: string;
                      dictBodyTestType: string;
                      dictBodyTestId: string | null;
                      dictBodyTest: string;
                      dictUnitType: string;
                      dictUnitId: string | null;
                      dictUnit: string;
                      action: string;
                      value: string;
                      goalDate: Date;
                      insertDate: Date;
}

export type UpdateGoal = {
                          id: string;
                          clientId: string;
                          dictBodyParamId: string | null;
                          dictBodyTestId: string | null;
                          dictUnitId: string | null;
                          action: string;
                          value: string;
                          goalDate: string;
};

export interface Program {
                          id: string;
                          programName: string;
                          createdBy: number;
                          createDate: string;
                          clientName: string;
}

export interface NewProgram {
                            id: string;
                            programName: string;
                            createdBy: number;
}

export interface ProgramDetails {
                                  programId: string;
                                  assignedClient: string;
}

export interface ProgramAssignedClient {
                          id: string;
                          assignedClient: string;
}

export type GoalDetailsDto = {
                              clientId: string;
                              bodyParamName: string;
                              bodyTestName: string;
                              unitName: string;
                              action: string;
                              value: string;
}

export type NewMacrocycleDto = {
                                id: string;
                                programId: string;
                                duration: number;
                                mesocycleDuration: number;
                                periodization: string; 
                                durationSession: number;
                                sessionsForMicrocycle: number;
};

export type MacrocycleDto = {
                              id: string;
                              programId: string;
                              duration: number;
                              durationLeft: number;
}

export type MesocycleDto = {
                              id: string;
                              macrocycleId: string;
                              duration: number;
                              orderId: number;
                              comments: string;
                              dictType: string;
                              dictId: number;
                              dictName: string;
                              label: string;
}

export type NewMesocycleDto = {
                                id: string;
                                macrocycleId: string;
                                duration: number;
                                comments: string;
}

export type MicrocycleDto = {
                              id: string;
                              mesocycleId: string;
                              orderId: number;
                              share: boolean;
}

export type MicrocycleStatsDto = {
                                    category: string;
                                    repetitions: number;
                                    sets: number;
}

export type PeriodizationDto = {
                              name: string;
                              description: string;
}

export type SessionDto = {
                            id: string;
                            microcycleId: string;
                            orderId: number;
                            label: string;
                            dateTime: string;
}

export type DictSessionPartDto = {
                                  id: string;
                                  dict: string;
                                  dict_id: string;
                                  name: string
}

export interface DictEquipment {
                                  id: string;
                                  name: string;
                                  dict: string;
                                  dict_id: string;
}

export interface NewDictEquipment {
                                    id: string;
                                    name: { [key: string]: string };
                                  }

export interface TranslationsDictEquipmentDto {
                                  id: string;
                                  name: { [key: string]: string };
}                                  

export interface ExerciseStats {
                                orderId: number;
                                category: string;
                                repetitions: number;
                                sets: number;
}

export interface CopyParametersDto {
                                  weightIncrease: number;
                                  weightIncreaseUnit: string;
                                  repetitions: number;
}

export interface DiagramTrainingsFrequency {
                                          trainingDate: string,
                                          count: number
}

export interface DiagramRepetitionsSetsVolumeForEachTrainingAndDate {
                                        trainingWeek: string,
                                        category: string
                                        sets: number
                                        repetitions: number
                                        volume: number
}

export interface VolumeMaxVolumeAvgVolumeForEachExerciseEachTraining {
                                                                      category: string;
                                                                      exercise: string;
                                                                      date: string; // ISO string (np. "2025-04-07")
                                                                      volumeCol01: number;
                                                                      volumeCol02: number;
                                                                      volumeCol03: number;
                                                                      volumeCol04: number;
                                                                      volumeCol05: number;
                                                                      volumeAvg: number;
                                                                      volumeMax: number;
}

export interface TimeMaxTimeAvgTimeForEachExerciseEachTraining {
                                                                      category: string;
                                                                      exercise: string;
                                                                      date: string; // ISO string (np. "2025-04-07")
                                                                      timeCol01: number;
                                                                      timeCol02: number;
                                                                      timeCol03: number;
                                                                      timeCol04: number;
                                                                      timeCol05: number;
                                                                      timeAvg: number;
                                                                      timeMax: number;
}

export interface CardDto {
                              id: string;
                              title: string;
                              description: string;
                              experience: string;
                              phone: string;
                              mail: string;
                              instagram: string;
                              www: string;
                              online: boolean;
}

export interface CardAddressDto {
                                      id: string;
                                      city: string;
                                      gymName: string;
                                      gymAddress: string;
                                      countryName: string;
                                      countryId: string;
}

export interface DictCountryDto {
                                      id: string;
                                      name: string;
                                      code: string;
}

export interface CardPhotoDto {
                                      id: string;
                                      cardId: string;
                                      photoUrl: string;
                                      orderNumber?: number;
}

export interface CardAddressDto {
                                      street: string;
                                      postalCode: string;
                                      city: string;
                                      country: string;
}

export interface CardViewDto {
                              id: string;
                              title: string;
                              description: string;
                              experience: string;
                              phone: string;
                              mail: string;
                              instagram: string;
                              www: string;
                              online: boolean;
                              addresses: CardAddressDto[];
                              photos: CardPhotoDto[];
}

export interface CardStatusDto { 
                                    cardId: string;
                                    dictCardStatusId: string;
                                    dictCardStatusName: string;
                                    comment: string;
}

export interface DictCardStatusDto {
                                    id: string;
                                    statusName: string;
}

export interface BodyPhotoDto {
                                      id: string;
                                      userId: string;
                                      photoUrl: string;
                                      orderNumber?: number;
                                      date: string;
}

export interface BodyPhotoEditDateDto {
                                      id: string;
                                      date: string;
}

export interface DictTagsCategoryDto {
                                      id: string;
                                      name: string;
}
export interface NewDictTagsCategory {
                                      id: string;
                                      name: { [key: string]: string };
}

export interface DictTagsDto {
                              id: string;
                              dict: string;
                              category: DictTagsCategoryDto;
                              dict_id: string;
                              name: string;
                              description: string;
}

export interface NewDictTagsDto {
                                 id: string;
                                 dict: string;
                                 category: DictTagsCategoryDto;
                                 dict_id: string;
                                 name: string;
                                 description: string;
}

export interface TranslationsDictTagsDto {
                                    id: number;
                                    name: { [key: string]: string };
                                    description: { [key: string]: string };
}
export interface TagDto {
                              tagId: string;
                              name: string;
}

export interface BodyPhotoTagsDto {
                                      photoId: string;
                                      photoTags: Record<string, string>;
}

export interface BodyPhotoShareDto {
                                      bodyPhotoShareId: string;
                                      userId: number;
                                      name: string;
}

export interface ExerciseAttachmentDto {
                                    id: string,
                                    photoUrl: string,
                                    extension: string,
                                    date: Date

}

export interface CommentDto {
                                    id: string;
                                    author: string;
                                    content: string;
                                    authorId: number;
                                    createdAt: string;
}

export interface NewCommentDto {
                                    content: string;
                                    origin: string;
                                    originId: string;
}