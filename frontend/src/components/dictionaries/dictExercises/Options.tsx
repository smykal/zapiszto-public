import React, { useState } from "react";
import DictExercisesService from "../../../services/dict/DictExercisesService";
import { withTranslation } from "react-i18next";
import Modal from "../../../constants/Modal";
import ExercisesAttachmentsAddForDictExercise from "../../exercisesAttachments/ExercisesAttachmentsAddForDictExercise";
import { DictExercises } from "../../../types/types";

type Props = {
    dictExercise: DictExercises;
    // item: string;
    //dict: string;
    onDeleteExercise: (id: string) => void;
    onEditExercise: (exerciseId: string, dict: string) => void;
    t: any;
};

const Options: React.FC<Props> = ({ dictExercise, onDeleteExercise, onEditExercise, t }) => {
    const [showModal, setShowModal] = useState(false);

    const openOptionsModal = () => {
        setShowModal(true);
    };

    const deleteExercise = (itemId: string) => {
        DictExercisesService.deleteDictExercise(itemId)
            .then(() => {
                onDeleteExercise(itemId);
                setShowModal(false);
            })
            .catch(error => {
                console.error('Error deleting exercise:', error);
            });
    };

    return (
        <>
            <img src="/images/navigation/options.svg" alt="Options" style={{ cursor: "pointer", width: "24px", height: "24px" }} onClick={openOptionsModal} />

            <Modal show={showModal} onClose={() => setShowModal(false)} title={t("table.options")}>
                <div>
                    <div>
                        <button 
                            onClick={() => deleteExercise(dictExercise.dict_id)} 
                            className="buttonDelete width_15rem">
                            {t("buttons.delete")}
                        </button>
                        <p>{t("buttons.delete_exercise_description")}<br /><br /></p>
                    </div>
                    <ExercisesAttachmentsAddForDictExercise dictExerciseId={dictExercise.id} />
                    <div>
                        <button 
                        onClick={() => { onEditExercise(dictExercise.dict_id, dictExercise.dict); setShowModal(false); }}
                        className="width_15rem">
                            {t("buttons.edit")}
                        </button>
                        {/* <p>{t("buttons.edit_description")}<br /><br /></p> */}
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default withTranslation("global")(Options);
