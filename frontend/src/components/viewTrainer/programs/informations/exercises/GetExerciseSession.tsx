import React, { Component } from 'react';
import EditableSelectCell from '../../../../../common/EditableSelectCell';
import EditableSelectEquipment from '../../../../../common/EditableSelectEquipment';
import EditableCell from '../../../../../common/EditableCell';
import EditableNumberCell from '../../../../../common/EditableNumberCell';
import EditableNumberFloatCell from '../../../../../common/EditableNumberFloatCell';
import EditableSelectExercise from '../../../../../common/EditableSelectExercise';
import { ExerciseSession, DictSessionPartDto, DictQuantityType, DictExercises, DictUnits, DictEquipment, DictCategories } from '../../../../../types/types';
import { withTranslation } from "react-i18next";
import ExercisesSessionService from '../../../../../services/exercises/session/ExercisesSessionService';
import DictSessionPartService from '../../../../../services/dict/DictSessionPartService';
import DictQuantityTypeService from '../../../../../services/dict/DictQuantityTypeService';
import DictExercisesService from '../../../../../services/dict/DictExercisesService';
import DictUnitsService from '../../../../../services/dict/DictUnitsService';
import DictEquipmentService from '../../../../../services/dict/DictEquipmentService';
import DictCategoryService from '../../../../../services/dict/DictCategoryService';
import Modal from '../../../../../constants/Modal';
import CopyToNextWeekSession from './CopyToNextWeekSession';
import CopyToNextDaySession from './CopyToNextDaySession';
import Options from './Options';
import AddExerciseSession from './AddExerciseSession';
import EditableExecutedCell from '../../../../../common/EditableExecutedCell';
import ExercisesAttachmentsShow from '../../../../exercisesAttachments/ExercisesAttachmentsShow';

type Props = {
  session_id: string;
  microcycle_id: string;
  mesocycle_id: string;
  t: any;
  onSessionChanged?: () => void;
}

type State = {
  exercises: ExerciseSession[];
  sessionPartOptions: DictSessionPartDto[];
  quantityTypeOptions: DictQuantityType[];
  exercisesOptions: DictExercises[];
  unitsOptions: DictUnits[];
  equipmentOptions: DictEquipment[];
  categoriesOptions: DictCategories[];
  showModal: boolean;
  showNextDayModal: boolean;
  showAddExerciseModal: boolean;
}

class GetExerciseSession extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      exercises: [],
      sessionPartOptions: [],
      quantityTypeOptions: [],
      exercisesOptions: [],
      unitsOptions: [],
      equipmentOptions: [],
      categoriesOptions: [],
      showModal: false,
      showNextDayModal: false,
      showAddExerciseModal: false
    };
  }

  componentDidMount() {
    this.loadExercises();
    this.loadSessionPartOptions();
    this.loadQuantityTypeOptions();
    this.loadExercisesOptions();
    this.loadUnitsOptions();
    this.loadEquipmentOptions();
    this.loadCategoriesOptions();
  }

  loadExercises() {
    const { session_id } = this.props;
    ExercisesSessionService.getExercisesBySession(session_id)
      .then(response => {
        const sortedExercises = response.data.sort((a: ExerciseSession, b: ExerciseSession) => a.orderNumber - b.orderNumber);
        this.setState({ exercises: sortedExercises });
      })
      .catch(error => {
        console.error('Error loading exercises:', error);
      });
  }

  loadCategoriesOptions() {
    DictCategoryService.getDictCategory()
      .then(response => {
        this.setState({ categoriesOptions: response.data });
      })
      .catch(error => {
        console.error('Error loading category options:', error);
      });
  }

  loadExercisesOptions() {
    DictExercisesService.getDictExercises()
      .then(response => {
        this.setState({ exercisesOptions: response.data });
      })
      .catch(error => {
        console.error('Error loading exercises options:', error);
      });
  }

  loadSessionPartOptions() {
    DictSessionPartService.getSessionPartOptions()
      .then(response => {
        this.setState({ sessionPartOptions: response.data });
      })
      .catch(error => {
        console.error('Error loading session part options:', error);
      });
  }

  loadQuantityTypeOptions() {
    DictQuantityTypeService.getDictQuantityTypes()
      .then(response => {
        this.setState({ quantityTypeOptions: response.data });
      })
      .catch(error => {
        console.error('Error loading quantity type options:', error);
      });
  }

  loadUnitsOptions() {
    DictUnitsService.getDictUnits()
      .then(response => {
        this.setState({ unitsOptions: response.data });
      })
      .catch(error => {
        console.error('Error loading units options:', error);
      });
  }

  loadEquipmentOptions() {
    DictEquipmentService.getDictEquipment()
      .then(response => {
        this.setState({ equipmentOptions: response.data });
      })
      .catch(error => {
        console.error('Error loading equipment options:', error);
      });
  }

  handleSaveExercise(exerciseId: string, newExerciseId: string) {
    const newExercise = this.state.exercisesOptions.find(option => option.id === newExerciseId);

    if (newExercise) {
      ExercisesSessionService.updateExercise(exerciseId, { id: newExercise.id })
        .then(() => {
          this.setState(prevState => ({
            exercises: prevState.exercises.map(ex =>
              ex.exerciseId === exerciseId
                ? { ...ex, dictExerciseName: newExercise.name, dictCategoryName: newExercise.category_name }
                : ex
            )
          }));
        })
        .catch(error => {
          console.error('Error updating exercise:', error);
        });
    }
  }

  handleSaveSessionPart(exerciseId: string, newSessionPartName: string) {
    const newSessionPart = this.state.sessionPartOptions.find(option => option.name === newSessionPartName);

    if (newSessionPart) {
      ExercisesSessionService.updateDictSessionPart(exerciseId, newSessionPart.id)
        .then(() => {
          this.setState(prevState => ({
            exercises: prevState.exercises.map(ex =>
              ex.exerciseId === exerciseId ? { ...ex, dictSessionPartName: newSessionPartName } : ex
            )
          }));
        })
        .catch(error => {
          console.error('Error updating session part:', error);
        });
    }
  }

  handleSaveQuantityType(exerciseId: string, newQuantityTypeName: string) {
    const newQuantityType = this.state.quantityTypeOptions.find(option => option.name === newQuantityTypeName);

    if (newQuantityType) {
      ExercisesSessionService.updateDictQuantityType(exerciseId, newQuantityType.id)
        .then(() => {
          this.setState(prevState => ({
            exercises: prevState.exercises.map(ex =>
              ex.exerciseId === exerciseId ? { ...ex, dictQuantityTypeName: newQuantityTypeName } : ex
            )
          }));
        })
        .catch(error => {
          console.error('Error updating quantity type:', error);
        });
    }
  }

  handleSaveNotes(exerciseId: string, newNotes: string) {
    ExercisesSessionService.updateNotes(exerciseId, { notes: newNotes })
      .then(() => {
        this.setState(prevState => ({
          exercises: prevState.exercises.map(ex =>
            ex.exerciseId === exerciseId ? { ...ex, notes: newNotes } : ex
          )
        }));
      })
      .catch(error => {
        console.error('Error updating notes:', error);
      });
  }

  handleSaveTempo(exerciseId: string, newTempo: string) {
    ExercisesSessionService.updateTempo(exerciseId, { tempo: newTempo })
      .then(() => {
        this.setState(prevState => ({
          exercises: prevState.exercises.map(ex =>
            ex.exerciseId === exerciseId ? { ...ex, tempo: newTempo } : ex
          )
        }));
      })
      .catch(error => {
        console.error('Error updating tempo:', error);
      });
  }

  handleSaveQuantity(exerciseId: string, newQuantity: number) {
    ExercisesSessionService.updateQuantity(exerciseId, { quantity: newQuantity })
      .then(() => {
        this.setState(prevState => ({
          exercises: prevState.exercises.map(ex =>
            ex.exerciseId === exerciseId ? { ...ex, quantity: newQuantity } : ex
          )
        }));
      })
      .catch(error => {
        console.error('Error updating quantity:', error);
      });
  }

  handleSaveVolume(exerciseId: string, newVolume: number) {
    ExercisesSessionService.updateVolume(exerciseId, { volume: newVolume })
      .then(response => {
        const newWeightPerSide = response.data; // Get the weight per side from the response
        this.setState(prevState => ({
          exercises: prevState.exercises.map(ex =>
            ex.exerciseId === exerciseId ?
              { ...ex, volume: newVolume, weightPerSide: newWeightPerSide !== null ? newWeightPerSide : ex.weightPerSide }
              : ex
          )
        }));
      })
      .catch(error => {
        console.error('Error updating volume:', error);
      });
  }

  handleSaveRestTime(exerciseId: string, newRestTime: number) {
    ExercisesSessionService.updateRestTime(exerciseId, { restTime: newRestTime })
      .then(() => {
        this.setState(prevState => ({
          exercises: prevState.exercises.map(ex =>
            ex.exerciseId === exerciseId ? { ...ex, restTime: newRestTime } : ex
          )
        }));
      })
      .catch(error => {
        console.error('Error updating rest time:', error);
      });
  }

  handleSaveUnit(exerciseId: string, newUnitName: string) {
    const newUnit = this.state.unitsOptions.find(option => option.name === newUnitName);

    if (newUnit) {
      ExercisesSessionService.updateDictUnit(exerciseId, { dictUnitId: newUnit.id })
        .then(() => {
          this.setState(prevState => ({
            exercises: prevState.exercises.map(ex =>
              ex.exerciseId === exerciseId ? { ...ex, dictUnitName: newUnitName } : ex
            )
          }));
        })
        .catch(error => {
          console.error('Error updating unit:', error);
        });
    }
  }

  handleSaveSets(exerciseId: string, newSets: number) {
    ExercisesSessionService.updateSets(exerciseId, { sets: newSets })
      .then(() => {
        this.setState(prevState => ({
          exercises: prevState.exercises.map(ex =>
            ex.exerciseId === exerciseId ? { ...ex, sets: newSets } : ex
          )
        }));
      })
      .catch(error => {
        console.error('Error updating sets:', error);
      });
  }

  handleSaveEquipment(exerciseId: string, newEquipmentName: string | null) {
    const newEquipment = this.state.equipmentOptions.find(option => option.name === newEquipmentName);

    if (newEquipmentName === null) {
      ExercisesSessionService.updateEquipment(exerciseId, { dictEquipmentId: null })
        .then(() => {
          this.setState(prevState => ({
            exercises: prevState.exercises.map(ex =>
              ex.exerciseId === exerciseId ? { ...ex, equipmentName: null } : ex
            )
          }));
        })
        .catch(error => {
          console.error('Error clearing equipment:', error);
        });
    } else if (newEquipment) {
      ExercisesSessionService.updateEquipment(exerciseId, { dictEquipmentId: newEquipment.id })
        .then(() => {
          this.setState(prevState => ({
            exercises: prevState.exercises.map(ex =>
              ex.exerciseId === exerciseId ? { ...ex, equipmentName: newEquipmentName } : ex
            )
          }));
        })
        .catch(error => {
          console.error('Error updating equipment:', error);
        });
    }
  }


  handleSaveEquipmentAttribute(exerciseId: string, newEquipmentAttribute: string) {
    ExercisesSessionService.updateEquipmentAttribute(exerciseId, { equipmentAttribute: newEquipmentAttribute })
      .then(response => {
        const newWeightPerSide = response.data; // Get the weight per side from the response
        this.setState(prevState => ({
          exercises: prevState.exercises.map(ex =>
            ex.exerciseId === exerciseId ? { ...ex, equipmentAttribute: newEquipmentAttribute, weightPerSide: newWeightPerSide } : ex
          )
        }));
      })
      .catch(error => {
        console.error('Error updating equipment attribute:', error);
      });
  }

  handleSaveWeightPerSide(exerciseId: string, newWeightPerSide: number) {
    // ExercisesSessionService.updateWeightPerSide(exerciseId, { weightPerSide: newWeightPerSide })
    //   .then(() => {
    //     this.setState(prevState => ({
    //       exercises: prevState.exercises.map(ex => 
    //         ex.exerciseId === exerciseId ? { ...ex, weightPerSide: newWeightPerSide } : ex
    //       )
    //     }));
    //   })
    //   .catch(error => {
    //     console.error('Error updating weight per side:', error);
    //   });
  }

  handleExerciseOptions = (update: ExerciseSession[] | ((prev: ExerciseSession[]) => ExerciseSession[])) => {
    if (typeof update === "function") {
      this.setState((prevState) => ({ exercises: update(prevState.exercises) }));
      this.loadExercises();
    } else {
      this.setState({ exercises: update });
    }
  };

  handleAddExercise = async () => {
    const { session_id } = this.props;
    try {
      const response = await ExercisesSessionService.addExercise(session_id);
      this.setState({ exercises: response.data });
    } catch (error) {
      console.error('Error adding exercise:', error);
    }
  };

  handleShowModal = () => {
    this.setState({ showModal: true });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  handleShowNextDayModal = () => {
    this.setState({ showNextDayModal: true });
  };

  handleCloseNextDayModal = () => {
    this.setState({ showNextDayModal: false });
  };

  handleShowAddExerciseModal = () => {
    this.setState({ showAddExerciseModal: true });
  };

  handleCloseAddExerciseModal = () => {
    this.setState({ showAddExerciseModal: false });
  };

  handleAddExerciseSession = (exercise: any) => {
    const { session_id } = this.props;
    ExercisesSessionService.addExerciseSession(session_id, { ...exercise, weightPerSide: exercise.weightPerSide ?? 0 })
      .then(res => {
        if (res.data) {
          this.setState(prev => ({
            exercises: [...prev.exercises, res.data],
            showAddExerciseModal: false
          }));
        } else {
          this.setState({ showAddExerciseModal: false });
        }
      })
      .catch(() => this.setState({ showAddExerciseModal: false }));
  };

  handleSaveDuration = (exerciseId: string, newDuration: number) => {
    ExercisesSessionService.updateExerciseDuration(exerciseId, { duration: newDuration })
      .then(() => {
        this.setState(prevState => ({
          exercises: prevState.exercises.map(ex =>
            ex.exerciseId === exerciseId ? { ...ex, duration: newDuration } : ex
          )
        }));
      })
      .catch(error => {
        console.error('Error updating duration:', error);
      });
  };

  render() {
    const { exercises, sessionPartOptions, quantityTypeOptions, exercisesOptions, unitsOptions, equipmentOptions, showModal, showNextDayModal, categoriesOptions } = this.state;
    const { t } = this.props;

    const sessionPartNames = sessionPartOptions.map(option => option.name);
    const quantityTypeNames = quantityTypeOptions.map(option => option.name);
    const unitsNames = unitsOptions.map(option => option.name);
    const equipmentNames = equipmentOptions.map(option => option.name);

    let cumulativeDuration = 0;

    return (
      <div>
        <div style={{ overflowX: "auto" }}>
          <table className="fixed-table">
            <thead>
              <tr>
                <th className="column-small">{/*t("table.order_number")*/}</th>
                <th className="column-small" ></th>
                <th>{t("table.session_part")}</th>
                <th>{t("table.category")}</th>
                <th className="column-small">{t("table.exercise")}</th>
                <th className="column-small">{/*t("table.volume")*/}</th>
                <th className="column-small">{t("table.unit")}</th>
                <th className="column-small">{/*t("table.quantity")*/}</th>
                <th className="column-small">{/*t("table.type")*/}</th>
                <th className="column-small">{t("table.sets")}</th>
                <th>{t("table.notes")}</th>
                <th className="column-small">{t("table.rest_time")}</th>
                <th >{t("table.tempo")}</th>
                <th className="column-medium">{t("table.equipment")}</th>
                <th>{t("table.equipment_attribute")}</th>
                <th className="column-small">{t("table.weight_per_side")}</th>
                <th className="column-medium">{t("table.exercise_duration")}</th>
                <th className="column-medium">{t("table.training_time")}</th>
                <th className='column-small'>executed</th>
              </tr>
            </thead>
            <tbody>
              {exercises.map((row) => {
                cumulativeDuration += ((row.duration ?? 0) + (row.restTime ?? 0)) * row.sets / 60;
                return (
                  <tr key={row.exerciseId} style={{ borderBottom: '1px solid #ddd' }}>
                    <td className="column-small">{row.orderNumber}</td>
                    <td>
                      <Options 
                      exerciseId={row.exerciseId} 
                      sessionId={row.sessionId} 
                      exerciseData={row} 
                      onExerciseOption={this.handleExerciseOptions} 
                      sessionPartOptions={sessionPartOptions}
                      categoriesOptions={categoriesOptions}
                      quantityTypeOptions={quantityTypeOptions}
                      unitsOptions={unitsOptions}
                      equipmentOptions={equipmentOptions}
                      />
                    </td>
                    <td>
                      <EditableSelectCell
                        value={row.dictSessionPartName}
                        options={sessionPartNames}
                        onSave={(newValue) => this.handleSaveSessionPart(row.exerciseId, newValue)}
                      />
                    </td>
                    <td style={{ color: "gray", cursor: "default" }}>{row.dictCategoryName}</td>
                    <td className="column-small">
                      <EditableSelectExercise
                        value={row.dictExerciseName}
                        options={exercisesOptions}
                        onSave={(newExerciseId) => this.handleSaveExercise(row.exerciseId, newExerciseId)}
                      />
                      {row.hasAttachment && <ExercisesAttachmentsShow dictExerciseId={row.dictExerciseId} />}
                    </td>
                    <td>
                      <EditableNumberFloatCell
                        value={row.volume ?? 0}
                        onSave={(newValue) => this.handleSaveVolume(row.exerciseId, newValue)}
                      />
                    </td>
                    <td>
                      <EditableSelectCell
                        value={row.dictUnitName}
                        options={unitsNames}
                        onSave={(newValue) => this.handleSaveUnit(row.exerciseId, newValue)}
                      />
                    </td>
                    <td>
                      <EditableNumberCell
                        value={row.quantity ?? 0}
                        onSave={(newValue) => this.handleSaveQuantity(row.exerciseId, newValue)}
                      />
                    </td>
                    <td>
                      <EditableSelectCell
                        value={row.dictQuantityTypeName}
                        options={quantityTypeNames}
                        onSave={(newValue) => this.handleSaveQuantityType(row.exerciseId, newValue)}
                      />
                    </td>
                    <td>
                      <EditableNumberCell
                        value={row.sets ?? 0}
                        onSave={(newValue) => this.handleSaveSets(row.exerciseId, newValue)}
                      />
                    </td>
                    <td>
                      <EditableCell
                        value={row.notes ?? ''}
                        onSave={(newValue) => this.handleSaveNotes(row.exerciseId, newValue)}
                      />
                    </td>
                    <td>
                      <EditableNumberCell
                        value={row.restTime ?? 0}
                        onSave={(newValue) => this.handleSaveRestTime(row.exerciseId, newValue)}
                      />
                    </td>
                    <td>
                      <EditableCell
                        value={row.tempo ?? ''}
                        onSave={(newValue) => this.handleSaveTempo(row.exerciseId, newValue)}
                      />
                    </td>
                    <td>
                      <EditableSelectEquipment
                        value={row.equipmentName || "--"}
                        options={equipmentNames}
                        onSave={(newValue) => this.handleSaveEquipment(row.exerciseId, newValue)}
                      />
                    </td>
                    <td>
                      <EditableCell
                        value={row.equipmentAttribute ?? '--'}
                        onSave={(newValue) => this.handleSaveEquipmentAttribute(row.exerciseId, newValue)}
                      />
                    </td>
                    <td style={{ color: "gray", cursor: "default" }} className='column-small'>
                      <EditableNumberCell
                        value={row.weightPerSide ?? 0}
                        onSave={(newValue) => this.handleSaveWeightPerSide(row.exerciseId, newValue)}
                      />
                    </td>
                    <td>
                      <EditableNumberCell
                        value={row.duration ?? 0}
                        onSave={(newValue) => this.handleSaveDuration(row.exerciseId, newValue)}
                      />
                    </td>
                    <td style={{ color: "gray", cursor: "default" }}>{parseInt(cumulativeDuration.toFixed(1))}</td>
                    <td>
                      <EditableExecutedCell
                        exerciseId={row.exerciseId}
                        value={row.executed ?? false}
                        onSave={(newValue) => {
                          this.setState((prev) => ({
                            exercises: prev.exercises.map((ex) =>
                              ex.exerciseId === row.exerciseId ? { ...ex, executed: newValue } : ex
                            ),
                          }));
                        }}
                        onUpdate={(exerciseId: string) =>                          ExercisesSessionService.updateExecuted(exerciseId)
                        }
                      />
                    </td>                  
                    </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* <button onClick={this.handleAddExercise}>{t('buttons.add_exercise')}</button> */}
        <button onClick={this.handleShowAddExerciseModal}>{t('buttons.add_exercise')}</button>
        <button onClick={this.handleShowModal}>{t('buttons.copy_to_next_session')}</button>
        <button onClick={this.handleShowNextDayModal}>{t('buttons.copy_to_next_day_session')}</button>

        <Modal show={showModal} onClose={this.handleCloseModal} title={t('buttons.copy_to_next_session')}>
          <CopyToNextWeekSession onClose={this.handleCloseModal} sessionId={this.props.session_id} microcycleId={this.props.microcycle_id} mesocycleId={this.props.mesocycle_id}/>
        </Modal>

        <Modal show={showNextDayModal} onClose={this.handleCloseNextDayModal} title={t('buttons.copy_to_next_day_session')}>
          <CopyToNextDaySession onClose={this.handleCloseNextDayModal} sessionId={this.props.session_id} onCopied={this.props.onSessionChanged} />
        </Modal>

        <Modal show={this.state.showAddExerciseModal} onClose={this.handleCloseAddExerciseModal} title={t('buttons.add_exercise')}>
          <AddExerciseSession
            show={this.state.showAddExerciseModal}
            onClose={this.handleCloseAddExerciseModal}
            onAdd={this.handleAddExerciseSession}
            sessionId={this.props.session_id}
            sessionPartOptions={this.state.sessionPartOptions}
            quantityTypeOptions={this.state.quantityTypeOptions}
            exercisesOptions={this.state.exercisesOptions}
            unitsOptions={this.state.unitsOptions}
            equipmentOptions={this.state.equipmentOptions}
            categories={this.state.categoriesOptions}
          />
        </Modal>
      </div>
    );
  }
}

export default withTranslation("global")(GetExerciseSession);