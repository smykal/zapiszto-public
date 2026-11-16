import React, { Component } from "react";
import ExercisesSessionService from '../../../../../services/exercises/session/ExercisesSessionService';
import { withTranslation } from "react-i18next";

type Props = {
  exerciseId: string;
  sessionId: string;
  onExerciseOption: (updatedExercises: any[]) => void; // Function to update exercises list
  t: any;
};
type State = {};

class OptionsMove extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  handleMoveUp = async () => {
    const { exerciseId, sessionId, onExerciseOption } = this.props;
    try {
      const response = await ExercisesSessionService.updateExerciseOrderNumberUp(sessionId, exerciseId);
      onExerciseOption(response.data);
    } catch (error) {
      console.error('Error moving exercise up:', error);
    }
  };

  handleMoveDown = async () => {
    const { exerciseId, sessionId, onExerciseOption } = this.props;
    try {
      const response = await ExercisesSessionService.updateExerciseOrderNumberDown(sessionId, exerciseId);
      onExerciseOption(response.data);
    } catch (error) {
      console.error('Error moving exercise down:', error);
    }
  };

  render() {
    const { t } = this.props;
    return (
      <div>
        <button onClick={this.handleMoveUp}>{t("buttons.move_up")}</button>
        &nbsp; &nbsp;
        <button onClick={this.handleMoveDown}>{t("buttons.move_down")}</button>
        {/* <p>{t("buttons.move_description")}<br/><br/></p> */}
        <br /><br />
      </div>
    );
  }
}

export default withTranslation("global")(OptionsMove);
