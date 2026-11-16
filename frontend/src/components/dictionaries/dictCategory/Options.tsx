import React, { useState } from "react";
import Service from '../../../services/dict/DictCategoryService';
import { withTranslation } from "react-i18next";
import Modal from "../../../constants/Modal";

type Props = {
    item: string;
    onDeleteCategory: (id: string) => void;
    t: any;
};

const Options: React.FC<Props> = ({ item, onDeleteCategory, t }) => {
    const [showModal, setShowModal] = useState(false);

    const openDeleteModal = () => {
        setShowModal(true);
    };

    const deleteCategory = (itemId: string) => {
        Service.deleteDictCategory(itemId)
            .then(() => {
                onDeleteCategory(itemId);
                setShowModal(false);
            })
            .catch(error => {

                if (error.response?.status === 409 &&
                    error.response.data.code === "CATEGORY_IN_USE") {

                    const count = error.response.data.count;

                    alert(
                        t("errors.category_in_use", {
                            count
                        })
                    );

                    return;
                }

                console.error(error);
            });
    }

    return (
        <>
            <img
                src="/images/navigation/options.svg"
                alt="Options"
                className="options-icon enabled"
                onClick={openDeleteModal}
            />

            <Modal show={showModal} onClose={() => setShowModal(false)} title={t("table.options")}>

                <div>
                    <button
                        onClick={() => deleteCategory(item)}
                        className="buttonDelete width_15rem">
                        {t("buttons.delete")}
                    </button>
                    <p>{t("buttons.delete_category_description")}</p>
                </div>
            </Modal>
        </>
    );
}

export default withTranslation("global")(Options);
