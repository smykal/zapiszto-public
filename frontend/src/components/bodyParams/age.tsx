import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { useGetAge } from "../../services/bodyParams/BodyParamsTanstackService";
import PostAge from "./postAge";
import Modal from "../../constants/Modal";
import Spinner from "../../common/Spinner";

type Props = {
    updateData: () => void;
};

const Age: React.FC<Props> = ({ updateData }) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const { t } = useTranslation("global");
    const { isLoading } = useGetAge();

    const refreshAge = () => {
        updateData();
        setIsModalOpen(false);
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="center">
            <button
                className="width_15rem"
                onClick={() => setIsModalOpen(true)}
            >
                {t("buttons.update")}
            </button>

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} title={t("body_params.update_age")}>
                <PostAge updateData={refreshAge} />
            </Modal>
        </div>
    );
};

export default Age;
