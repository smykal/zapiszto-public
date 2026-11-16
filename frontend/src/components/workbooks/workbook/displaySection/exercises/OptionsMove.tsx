import React, { Component } from "react";
import ExercisesTrainingService from '../../../../../services/exercises/training/ExercisesTrainingService';
import { withTranslation } from "react-i18next";
import Spinner from "../../../../../common/Spinner";

type Props = {
  exerciseId: string;
  trainingId: number;
  onExerciseUpdate: () => Promise<void>; // Funkcja do odświeżenia listy
  t: any;
};
type State = {
  loading: boolean; // Dodaj stan loading
};

class OptionsMove extends Component<Props, State> {
  state: State = {
    loading: false, // Inicjalizuj stan loading jako false
  };

  handleMoveUp = async () => {
    const { exerciseId, trainingId, onExerciseUpdate } = this.props;
    this.setState({ loading: true });
    try {
      await ExercisesTrainingService.updateExerciseOrderNumberUp(trainingId, exerciseId);
      await onExerciseUpdate(); // Aktualizuj listę
    } catch (error) {
      console.error('Error moving exercise up:', error);
    } finally {
      this.setState({ loading: false });
    }
  };

  handleMoveDown = async () => {
    const { exerciseId, trainingId, onExerciseUpdate } = this.props;
    this.setState({ loading: true });
    try {
      await ExercisesTrainingService.updateExerciseOrderNumberDown(trainingId, exerciseId);
      await onExerciseUpdate(); // Aktualizuj listę
    } catch (error) {
      console.error('Error moving exercise down:', error);
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { t } = this.props;
    const { loading } = this.state;
    return (
      <div>
        {loading ? (
          <Spinner />
        ) : (
          <>
            <button onClick={this.handleMoveUp}>{t("buttons.move_up")}</button>
            &nbsp; &nbsp;
            <button onClick={this.handleMoveDown}>{t("buttons.move_down")}</button>
          </>
        )}
        <br /><br />
      </div>
    );
  }
}

export default withTranslation("global")(OptionsMove);
