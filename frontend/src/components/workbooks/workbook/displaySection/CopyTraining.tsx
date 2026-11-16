import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import { useGetTrainings, useCopyTraining } from "../../../../services/trainings/TrainingsTanstackService";
import Modal from "../../../../constants/Modal";
import Weekday from "../../../../common/Weekday";

type Props = {
    workbook_id: number;
    onRefresh: () => void;
    t: any;
};

const CopyTraining: React.FC<Props> = ({ workbook_id, onRefresh, t }) => {
    const [selectedTrainingId, setSelectedTrainingId] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const { data: trainings = [] } = useGetTrainings(workbook_id);
    const copyTraining = useCopyTraining();

    const toggleModal = () => {
        setShowModal((prevState) => !prevState);
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTrainingId(Number(e.target.value));
    };

    const handleCopy = async () => {
        if (!selectedTrainingId) return;

        try {
            await copyTraining.mutateAsync(selectedTrainingId);
            setShowModal(false);
            onRefresh();
        } catch (error) {
            console.error("Błąd podczas kopiowania treningu:", error);
        }
    };

    return (
        <div style={{ margin: "1em 0" }}>
            <button onClick={toggleModal}>
                {t("buttons.copy_training")}
            </button>

            <Modal
                show={showModal}
                onClose={toggleModal}
                title={t("buttons.copy_training")}
            >
                <div className="center">
                    <select
                        onChange={handleSelectChange}
                        value={selectedTrainingId || ""}
                        style={{ marginBottom: "1em", padding: "0.5em", width: "100%" }}
                    >
                        <option value="" disabled>
                            {t("workbooks.select_training_to_copy")}
                        </option>
                        {trainings.map((training: any) => (
                            <option key={training.id} value={training.id}>                                
                                <Weekday date={new Date(training.date).toISOString().slice(0, 10)} />
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={handleCopy}
                        disabled={!selectedTrainingId || copyTraining.isPending}
                        className="field"
                    >
                        {t("buttons.copy")}
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default withTranslation("global")(CopyTraining);
