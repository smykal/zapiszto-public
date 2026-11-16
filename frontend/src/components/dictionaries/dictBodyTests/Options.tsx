import React, { useState } from "react";
import DictBodyTestService from "../../../services/dict/DictBodyTestService";
import { withTranslation } from "react-i18next";
import Modal from "../../../constants/Modal";

type Props = {
    item: string;
    dict: string;
    onDeleteBodyTest: (bodyTestId: string) => void;
    onEditBodyTest: (bodyTestId: string, dict: string) => void;
    t: any;
};

const Options: React.FC<Props> = ({ item, dict, onDeleteBodyTest, onEditBodyTest, t }) => {
    const [showModal, setShowModal] = useState(false);

    const openOptionsModal = () => {
        setShowModal(true);
    };

    const deleteBodyTest = (bodyTestId: string) => {
        DictBodyTestService.deleteDictBodyTest(bodyTestId)
            .then(() => {
                onDeleteBodyTest(bodyTestId);
                setShowModal(false);
            })
            .catch(error => {
                console.error('Error deleting body test:', error);
            });
    };

    return (
        <div>
            <img
                src="/images/navigation/options.svg"
                alt="Options"
                style={{ cursor: "pointer", width: "24px", height: "24px" }}
                onClick={openOptionsModal}
            />

            <Modal show={showModal} onClose={() => setShowModal(false)} title={t("table.options")}>
                <>
                    <div>
                        <button
                            onClick={() => deleteBodyTest(item)}
                            className="buttonDelete width_15rem">
                            {t("buttons.delete")}
                        </button>
                        <p>{t("buttons.delete_exercise_description")}<br /><br /></p>
                    </div>
                    <div>
                        <button
                            onClick={() => { onEditBodyTest(item, dict); setShowModal(false); }}
                            className="buttonEdit width_15rem">
                            {t("buttons.edit")}
                        </button>
                    </div>
                </>
            </Modal>
        </div>
    );
};

export default withTranslation("global")(Options);
