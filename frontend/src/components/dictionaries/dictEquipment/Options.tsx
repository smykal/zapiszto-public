import React, { useState } from "react";
import DictEquipmentService from "../../../services/dict/DictEquipmentService";
import { withTranslation } from "react-i18next";
import Modal from "../../../constants/Modal";

type Props = {
    item: string;
    dict: string;
    onDeleteEquipment: (equipmentId: string) => void;
    onEditEquipment: (equipmentId: string, dict: string) => void;
    t: any;
};

const Options: React.FC<Props> = ({ item, dict, onDeleteEquipment, onEditEquipment, t }) => {
    const [showModal, setShowModal] = useState(false);

    const openOptionsModal = () => setShowModal(true);

    const deleteEquipment = (equipmentId: string) => {
        DictEquipmentService.deleteDictEquipment(equipmentId)
            .then(() => {
                onDeleteEquipment(equipmentId);
                setShowModal(false);
            })
            .catch(error => {
                console.error('Error deleting equipment:', error);
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
                <div>
                    <div>
                        <button
                            onClick={() => deleteEquipment(item)}
                            className="buttonDelete width_15rem">
                            {t("buttons.delete")}
                        </button>
                        <p>{t("buttons.delete_equipment_description")}<br /><br /></p>
                    </div>
                    <div>
                        <button
                            onClick={() => { onEditEquipment(item, dict); setShowModal(false); }}
                            className="buttonEdit width_15rem">
                            {t("buttons.edit")}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default withTranslation("global")(Options);
