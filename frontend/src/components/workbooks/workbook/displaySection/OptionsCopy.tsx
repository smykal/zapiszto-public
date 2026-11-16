import React, { Component } from "react";
import TrainingService from '../../../../services/trainings/TrainingsService';
import { withTranslation } from "react-i18next";

type Props = {
    trainingId: number;
    onTrainingOptionCopy: () => void; // Funkcja do odświeżenia listy
    closeModal: () => void;
    t: any;
};

class OptionsCopy extends Component<Props> {
    handleCopy = async () => {
    const { trainingId, onTrainingOptionCopy, closeModal } = this.props;

    try {
      await TrainingService.copyTraining(trainingId);
      onTrainingOptionCopy(); // Aktualizacja listy po skopiowaniu
      closeModal(); // Zamknięcie modala
    } catch (error) {
      console.error('Error copying training:', error);
    }
  };

    render() {
        const { t } = this.props;
        return (
            <div className="center">
                <button onClick={this.handleCopy} className="field" >
                    {t("buttons.copy_training")}
                </button>
                {/* <p>{t("buttons.copy_training_description")}<br /><br /></p> */}
            </div>
        );
    }
}

export default withTranslation("global")(OptionsCopy);
