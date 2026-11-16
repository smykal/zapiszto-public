import React, { Component } from "react";
import OptionsCopy from "./OptionsCopy";
import OptionsDelete from "./OptionsDelete";
import OptionsEditDate from "./OptionsEditDate";
import { withTranslation } from "react-i18next";
import Modal from "../../../../constants/Modal";

type Props = {
    trainingId: number;
    trainingDate: string;
    onTrainingOptionCopy: () => void;
    onTrainingOptionDelete: (trainingId: number) => void;
    onTrainingOptionDateUpdate: () => void;
    t: any;
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
        const {
            trainingId,
            trainingDate,
            onTrainingOptionCopy,
            onTrainingOptionDelete,
            onTrainingOptionDateUpdate,
            t,
        } = this.props;
        const { isModalOpen } = this.state;

        return (
            <div style={{ display: "flex", alignItems: "center" }}>
                <img
                    src="/images/navigation/options.svg"
                    alt={t("table.options")}
                    style={{ cursor: "pointer", width: "24px", height: "24px" }}
                    onClick={this.openModal}
                />
                <Modal show={isModalOpen} onClose={this.closeModal} title={t("table.options")}>
                    <div>
                        <div className="option-copy">
                            <OptionsCopy
                                trainingId={trainingId}
                                onTrainingOptionCopy={onTrainingOptionCopy}
                                closeModal={this.closeModal}
                            />
                        </div>
                        <div className="option-delete">
                            <OptionsDelete 
                            trainingId={trainingId} 
                            onTrainingOptionDelete={onTrainingOptionDelete} 
                            closeModal={this.closeModal}
                            />
                        </div>
                        <div>
                            <OptionsEditDate
                                trainingId={trainingId}
                                trainingDate={trainingDate}
                                onTrainingOptionDateUpdate={onTrainingOptionDateUpdate}
                                closeModal={this.closeModal}
                            />
                        </div>
                    </div>

                </Modal>
            </div>
        );
    }
}

export default withTranslation("global")(Options);
