import React, { useState } from "react";
import { withTranslation, useTranslation } from "react-i18next";
import Modal from "../../../constants/Modal";
import { DictTagsDto } from '../../../types/types';
import { useDeleteDictTag } from "../../../services/dict/DictTagsTanstackService";

type Props = {
    item: DictTagsDto;
    onEditTag: (tagId: string) => void;
};

const Options: React.FC<Props> = ({ item, onEditTag }) => {
    const { t } = useTranslation("global");

    const deleteDictTagMutation = useDeleteDictTag();

    const [showModal, setShowModal] = useState(false);

    const openOptionsModal = () => {
        setShowModal(true);
    };

    const deleteTag = (tagId: string) => {
        deleteDictTagMutation.mutate(tagId, {
            onSuccess: () => {
                setShowModal(false);
            },
            onError: (error) => {
                console.error("Error deleting tag:", error);
            },
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

            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                title={t("table.options")}
            >
                <div>
                    <div>
                        <button
                            className="buttonDelete"
                            onClick={() => deleteTag(item.dict_id)}
                            disabled={deleteDictTagMutation.isPending}
                        >
                            {t("buttons.delete")}
                        </button>

                        <p>
                            {t("buttons.delete_tag_description")}
                            <br />
                            <br />
                        </p>
                    </div>

                    <div>
                        <button
                            onClick={() => {
                                onEditTag(item.dict_id);
                                setShowModal(false);
                            }}
                        >
                            {t("buttons.edit")}
                        </button>

                        <p>{t("buttons.edit_tag_description")}</p>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default withTranslation("global")(Options);