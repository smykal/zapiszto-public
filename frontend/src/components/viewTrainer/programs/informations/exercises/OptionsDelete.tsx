import React, { Component } from "react";
import ExercisesSessionService from '../../../../../services/exercises/session/ExercisesSessionService';
import { withTranslation } from "react-i18next";

type Props = {
  exerciseId: string;
  sessionId: string;
  onExerciseOption: (updatedExercises: any[]) => void;
  t: any;
};
type State = {};

class OptionsDelete extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  handleDelete = async () => {
    const { exerciseId, sessionId, onExerciseOption, t } = this.props;
    const confirmMessage = `${t('buttons.delete_session_row')}`;

    if (window.confirm(confirmMessage)) {
      try {
        const response = await ExercisesSessionService.deleteExercise(sessionId, exerciseId);
        onExerciseOption(response.data);
      } catch (error) {
        console.error('Error deleting exercise:', error);
      }
    }
  }

  render() {
    const { t } = this.props;
    return (
      <div>
        <button onClick={this.handleDelete} className="buttonDelete">
          {t("buttons.delete")}
        </button>
      </div>
    );
  }
}

export default withTranslation("global")(OptionsDelete);
