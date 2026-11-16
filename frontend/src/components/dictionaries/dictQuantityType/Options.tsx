import React, { useState } from "react";
import DictQuantityTypeService from "../../../services/dict/DictQuantityTypeService";
import { withTranslation } from "react-i18next";
import Modal from "../../../constants/Modal";

type Props = {
    item: string;
    onDeleteQuantityType: (quantityTypeId: string) => void;
    onEditQuantityType: (quantityTypeId: string, dict: string) => void;
    dict: string;
    t: any;
};

const Options: React.FC<Props> = ({ item, onDeleteQuantityType, onEditQuantityType, dict, t }) => {
    const [showModal, setShowModal] = useState(false);

    const openOptionsModal = () => {
        setShowModal(true);
    };

    const deleteQuantityType = (quantityTypeId: string) => {
        DictQuantityTypeService.deleteDictQuantityType(quantityTypeId)
            .then(() => {
                onDeleteQuantityType(quantityTypeId);
                setShowModal(false);
            })
            .catch(error => {
                console.error('Error deleting quantity type:', error);
            });
    };

    return (
        <>
            <img src="/images/navigation/options.svg" alt="Options" style={{ cursor: "pointer", width: "24px", height: "24px" }} onClick={openOptionsModal} />

            <Modal show={showModal} onClose={() => setShowModal(false)} title={t("table.options")}>
                <div>
                    <div>
                        <button
                            onClick={() => deleteQuantityType(item)}
                            className="buttonDelete width_15rem">
                            {t("buttons.delete")}
                        </button>
                        <p>{t("buttons.delete_quantity_type_description")}<br /><br /></p>
                    </div>
                    <div>
                        <button
                            onClick={() => { onEditQuantityType(item, dict); setShowModal(false); }}
                            className="buttonEdit width_15rem">
                            {t("buttons.edit")}
                        </button>
                        <p>{t("buttons.edit_quantity_type_description")}</p>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default withTranslation("global")(Options);
