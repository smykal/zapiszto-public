import React, { Component } from "react";
import ExercisesTrainingService from '../../../../../services/exercises/training/ExercisesTrainingService';
import { withTranslation } from "react-i18next";
import Spinner  from "../../../../../common/Spinner";

type Props = {
    exerciseId: string;
    trainingId: number;
    onExerciseUpdate: () => Promise<void>; // Funkcja do odświeżenia listy
    t: any;
};

class OptionsCopy extends Component<Props, { loading: boolean }> {
    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
        };
    }

    handleCopy = async () => {
        const { exerciseId, trainingId, onExerciseUpdate } = this.props;
        this.setState({ loading: true });
        try {
            await ExercisesTrainingService.copyExercise(trainingId, exerciseId);
            await onExerciseUpdate(); // Aktualizacja listy po skopiowaniu
        } catch (error) {
            console.error('Error copying exercise:', error);
        } finally {
            this.setState({ loading: false });
        }
    };

    render() {
        const { t } = this.props;
        const { loading } = this.state;
        return (
            <div className="center">
                {loading ? (
                    <Spinner />
                ) : (
                    <button onClick={this.handleCopy}>
                        {t("buttons.copy")}
                    </button>
                )}
                <br /><br />
            </div>
        );
    }
}

export default withTranslation("global")(OptionsCopy);
