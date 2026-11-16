import React, { Component } from "react";
import OptionsDelete from "./OptionsDelete";
import OptionsMove from "./OptionsMove";
import OptionsCopy from "./OptionsCopy";
import OptionsEdit from "./OptionsEdit";
import OptionsCopyAndEdit from "./OptionsCopyAndEdit";
import ExercisesAttachmentsAddForExercise from "../../../../exercisesAttachments/ExercisesAttachmentsAddForExercise";
import { withTranslation } from "react-i18next";
import Modal from "../../../../../constants/Modal";

type Props = {
    exerciseId: string;
    trainingId: number;
    t: any;
    onExerciseUpdate: () => Promise<void>;
};

type State = {
    isModalOpen: boolean;
};

class Options extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isModalOpen: false,
        };
    }

    openModal = () => {
        this.setState({ isModalOpen: true });
    };

    closeModal = () => {
        this.setState({ isModalOpen: false });
    };

    render() {
        const { exerciseId, trainingId, onExerciseUpdate, t } = this.props;
        const { isModalOpen } = this.state;

        return (
            <div style={{ display: "flex", alignItems: "center" }}>
                {/* Ikona otwierająca modal */}
                <img
                    src="/images/navigation/options.svg"
                    alt="Options"
                    style={{ cursor: "pointer", width: "24px", height: "24px" }}
                    onClick={this.openModal}
                />

                {/* Modal zawierający wszystkie opcje */}
                <Modal show={isModalOpen} onClose={this.closeModal} title={t("table.options")}>
                    <div>
                        <div className="center">
                            <OptionsMove exerciseId={exerciseId} trainingId={trainingId} onExerciseUpdate={onExerciseUpdate} />
                        </div>
                        <div className="center">
                            <OptionsCopyAndEdit
                                exerciseId={exerciseId}
                                trainingId={trainingId}
                                onExerciseUpdate={async () => {
                                    await onExerciseUpdate();
                                    this.closeModal();
                                }} />
                        </div>
                        <div className="center">
                            <OptionsCopy
                                exerciseId={exerciseId}
                                trainingId={trainingId}
                                onExerciseUpdate={async () => {
                                    await onExerciseUpdate();
                                    this.closeModal();
                                }} />
                        </div>
                        <div className="center">
                            <OptionsEdit
                                exerciseId={exerciseId}
                                trainingId={trainingId}
                                onExerciseUpdate={async () => {
                                    await onExerciseUpdate();
                                    this.closeModal();
                                }} />
                        </div>
                        <div className="center">
                            <ExercisesAttachmentsAddForExercise exerciseId={exerciseId} />
                        </div>
                        <div className="center">
                            <OptionsDelete
                                exerciseId={exerciseId}
                                trainingId={trainingId}
                                onExerciseOptionDelete={async () => {
                                    await onExerciseUpdate();
                                    this.closeModal();
                                }} />
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default withTranslation("global")(Options);
