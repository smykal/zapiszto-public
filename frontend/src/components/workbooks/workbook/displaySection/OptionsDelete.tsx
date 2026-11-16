import React, { Component } from "react";
import TrainingService from '../../../../services/trainings/TrainingsService';
import { withTranslation } from "react-i18next";

type Props = {
    trainingId: number;
    onTrainingOptionDelete: (trainingId: number) => void;
    closeModal: () => void;
    t: any;
};
type State = {};

class OptionsDelete extends Component<Props, State> {
    handleDelete = async () => {
        const { trainingId, onTrainingOptionDelete, t, closeModal } = this.props;
        const confirmMessage = `${t('buttons.delete_session')}`;

        if (window.confirm(confirmMessage)) {
            try {
                await TrainingService.deleteTraining(trainingId);
                onTrainingOptionDelete(trainingId);
                closeModal(); 
            } catch (error) {
                console.error('Error deleting exercise:', error);
            }
        }
    };

    render() {
        const { t } = this.props;
        return (
            <div className="center">
                <button onClick={this.handleDelete} className="buttonDelete field">
                    {t("buttons.delete")}
                </button>
            </div>
        );
    }
}

export default withTranslation("global")(OptionsDelete);

