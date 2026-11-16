import React, { useState } from "react";
import { useDeleteDictUnit } from "../../../services/dict/DictUnitsTanstackService";
import { withTranslation } from "react-i18next";
import Modal from "../../../constants/Modal";
type Props = {
    item: string;
    onDeleteUnit: (unitId: string) => void;
    onEditUnit: (unitId: string, dict: string) => void;
    dict: string;
    t: any;
};

const Options: React.FC<Props> = ({ item, onDeleteUnit, onEditUnit, dict, t }) => {
    const [showModal, setShowModal] = useState(false);
    const deleteDictUnitMutation = useDeleteDictUnit();

    const openOptionsModal = () => {
        setShowModal(true);
    };

    const deleteUnit = (itemId: string) => {
        deleteDictUnitMutation.mutate(itemId, {
            onSuccess: () => {
                onDeleteUnit(itemId);
                setShowModal(false);
            },
            onError: (error) => {
                console.error('Error deleting unit:', error);
            }
        });
    };

    return (
        <>
            <img src="/images/navigation/options.svg" alt="Options" style={{ cursor: "pointer", width: "24px", height: "24px" }} onClick={openOptionsModal} />

            <Modal show={showModal} onClose={() => setShowModal(false)} title={t("table.options")}>
                <div>
                    <div>
                        <button
                            onClick={() => deleteUnit(item)}
                            className="buttonDelete width_15rem">
                            {t("buttons.delete")}
                        </button>
                        <p>{t("buttons.delete_unit_description")}<br /><br /></p>
                    </div>
                    <div>
                        <button
                            onClick={() => { onEditUnit(item, dict); setShowModal(false); }}
                            className="buttonEdit width_15rem">
                            {t("buttons.edit")}
                        </button>
                        <p>{t("buttons.edit_unit_description")}</p>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default withTranslation("global")(Options);
