import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import Modal from "../../../constants/Modal";
import { BodyParamsItem } from '../../../types/types';
import OptionsEdit from "./OptionsEdit";
import OptionsDelete from "./OptionsDelete";

type Props = {
    item: BodyParamsItem;
    onDelete: (id: number) => void;
    onUpdate: () => void;
    t: any;
};

const Options: React.FC<Props> = ({ item, onDelete, onUpdate, t }) => {
    const [showModal, setShowModal] = useState(false);
    const [editMode] = useState(false);

    return (
        <div>
            <img
                src="/images/navigation/options.svg"
                alt="Options"
                style={{ cursor: "pointer", width: "24px", height: "24px" }}
                onClick={() => setShowModal(true)}
            />

            <Modal show={showModal} onClose={() => setShowModal(false)} title={t("table.options")}>
                {!editMode ? (
                    <>
                        <div className="center">
                            <OptionsEdit item={item} onUpdate={() => {
                                onUpdate();
                                setShowModal(false);
                            }} t={t} />
                        </div>
                        <div className="center">
                            <OptionsDelete item={item} onDelete={onDelete} closeModal={() => setShowModal(false)} t={t} />
                        </div>
                    </>
                ) : null}
            </Modal>
        </div>
    );
};

export default withTranslation("global")(Options);
