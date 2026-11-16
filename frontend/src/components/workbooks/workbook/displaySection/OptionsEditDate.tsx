import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import Modal from "../../../../constants/Modal";
import TrainingService from "../../../../services/trainings/TrainingsService";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
    trainingId: number;
    trainingDate: string;
    onTrainingOptionDateUpdate: () => void;
    closeModal: () => void;
    t: any;
};

const DatePickerComponent = DatePicker as unknown as React.ComponentType<any>;

const parseTrainingDate = (trainingDate: string): Date => {
    const [year, month, day] = trainingDate.split("T")[0].split("-").map(Number);
    return new Date(year, month - 1, day);
};

const formatTrainingDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const OptionsEditDate: React.FC<Props> = ({
    trainingId,
    trainingDate,
    onTrainingOptionDateUpdate,
    closeModal,
    t,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [date, setDate] = useState<Date | null>(() => parseTrainingDate(trainingDate));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleEdit = async () => {
        if (!date) {
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            await TrainingService.patchTrainingDate(trainingId, formatTrainingDate(date));
            onTrainingOptionDateUpdate();
            setIsEditing(false);
            closeModal();
        } catch (requestError) {
            console.error("Error updating training date:", requestError);
            setError(t("session.update_error"));
        } finally {
            setIsSubmitting(false);
        }
    };

    const startEditing = () => {
        setDate(parseTrainingDate(trainingDate));
        setError("");
        setIsEditing(true);
    };

    return (
        <>
            <div className="center">
                <button onClick={startEditing} className="field">
                    {t("session.edit_date")}
                </button>
            </div>
            <Modal
                show={isEditing}
                onClose={() => setIsEditing(false)}
                title={t("session.edit_date")}
            >
                <div className="center" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <DatePickerComponent
                        selected={date}
                        onChange={(selectedDate: Date | null) => setDate(selectedDate)}
                        dateFormat="yyyy-MM-dd"
                        className="field"
                    />
                    {error && <p role="alert">{error}</p>}
                    <div>
                        <button onClick={() => setIsEditing(false)} className="field" disabled={isSubmitting}>
                            {t("buttons.cancel")}
                        </button>
                        <button onClick={handleEdit} className="field" disabled={!date || isSubmitting}>
                            {t("buttons.save")}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default withTranslation("global")(OptionsEditDate);
