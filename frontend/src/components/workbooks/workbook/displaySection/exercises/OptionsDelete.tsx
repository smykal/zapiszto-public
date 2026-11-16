import React, { Component } from "react";
import ExercisesTrainingService from '../../../../../services/exercises/training/ExercisesTrainingService';
import { withTranslation } from "react-i18next";

type Props = {
    exerciseId: string;
    trainingId: number;
    onExerciseOptionDelete: (exerciseId: string) => Promise<void>;
    t: any;
};
type State = {};

class OptionsDelete extends Component<Props, State> {
    handleDelete = async () => {
        const { exerciseId, trainingId, onExerciseOptionDelete, t } = this.props;
        const confirmMessage = `${t('buttons.delete_session_row')}`;

        if (window.confirm(confirmMessage)) {
            try {
                await ExercisesTrainingService.deleteExercise(trainingId, exerciseId);
                await onExerciseOptionDelete(exerciseId); // Przekazanie exerciseId do rodzica
            } catch (error) {
                console.error('Error deleting exercise:', error);
            }
        }
    };

    render() {
        const { t } = this.props;
        return (
            <div>
                <button onClick={this.handleDelete} className="buttonDelete">
                    {t("buttons.delete")}
                </button>
                {/* <p>{t("buttons.delete_description")}</p> */}
            </div>
        );
    }
}

export default withTranslation("global")(OptionsDelete);

